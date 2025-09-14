import os
import re
import logging
from typing import List

try:
    import PyPDF2
except ImportError:
    PyPDF2 = None
try:
    import docx
except ImportError:
    docx = None

# --- CONFIGURATION ---
# Directory to scan (change this to your local GDrive sync folder)
SCAN_DIR = "/Users/lucky/AcademigoDB"

# File extensions to check
FILE_EXTENSIONS = [".txt", ".pdf"]

# File extensions to check
FILE_EXTENSIONS = [".txt", ".pdf", ".docx", ".env"]

# Files to exclude from removal (but still scan and log if flagged)
EXCLUDE_FROM_REMOVAL = [".env"]


# Gemini LLM system prompt
SYSTEM_PROMPT = (
    "You are a file content classifier. \
    Given the content of a file, respond \
    with ONLY one word: 'educational' if \
    the content is intended to teach, explain, \
    or inform about an academic, scientific, \
    or technical subject; or 'non-educational' \
    if it is not. Do not provide any explanation."
)

# Gemini API imports
from google import genai
from google.genai import types

# Logging setup
logger = logging.getLogger("gdrive_scan")
logger.setLevel(logging.INFO)
formatter = logging.Formatter("%(asctime)s %(levelname)s: %(message)s")

# File handler (log file)
# file_handler = logging.FileHandler("gdrive_scan.log")
file_handler = logging.FileHandler(os.path.expanduser("~/gdrive_scan.log"))
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)

# Stream handler (console)
console_handler = logging.StreamHandler()
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)

def extract_text_from_file(filepath: str) -> str:
    ext = os.path.splitext(filepath)[1].lower()
    try:
        if ext == ".txt":
            with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                return f.read()
        elif ext == ".pdf" and PyPDF2:
            text = ""
            with open(filepath, "rb") as f:
                reader = PyPDF2.PdfReader(f)
                for page in reader.pages:
                    text += page.extract_text() or ""
            return text
        elif ext == ".docx" and docx:
            doc = docx.Document(filepath)
            return "\n".join([p.text for p in doc.paragraphs])
    except Exception as e:
        logging.warning(f"Failed to extract text from {filepath}: {e}")
    return ""

def contains_inappropriate(text: str):
    pass

def classify_content_with_gemini(client, content: str) -> str:
    # Truncate content if too long for API (e.g., 1000 chars)
    max_len = 1000
    content = content[:max_len]
    try:
        # Combine system prompt and user content into a single message
        combined_prompt = f"{SYSTEM_PROMPT}\n\nContent to classify:\n{content}"
        
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[combined_prompt],
            config=types.GenerateContentConfig(
                thinking_config=types.ThinkingConfig(thinking_budget=0)
            ),
        )
        result = response.text.strip().lower()
        return result
    except Exception as e:
        logger.error(f"Gemini API error: {e}")
        return "error"


def scan_and_remove(dir_path: str):
    logger.info(f"Starting scan in directory: {dir_path}")
    client = genai.Client(api_key="AIzaSyDcRZ_UrQBV40UHo20sGvZHDrnfd1zsZ94")
    quarantine_dir = os.path.join("/Users/lucky/", "quarantine")
    if not os.path.exists(quarantine_dir):
        os.makedirs(quarantine_dir)
    for root, _, files in os.walk(dir_path):
        # Skip the quarantine folder itself
        if os.path.abspath(root) == os.path.abspath(quarantine_dir):
            continue
        for fname in files:
            ext = os.path.splitext(fname)[1].lower()
            if ext not in FILE_EXTENSIONS:
                logger.debug(f"Skipping file (unsupported extension): {fname}")
                continue
            fpath = os.path.join(root, fname)
            logger.info(f"Scanning file: {fpath}")
            text = extract_text_from_file(fpath)
            if not text:
                logger.debug(f"No text extracted from: {fpath}")
                continue
            # LLM classification
            result = classify_content_with_gemini(client, text)
            if result == "non-educational":
                if ext in EXCLUDE_FROM_REMOVAL:
                    logger.warning(f"Flagged (but NOT moved) {fpath} as non-educational [EXCLUDED FILE]")
                else:
                    try:
                        # Preserve subfolder structure in quarantine
                        rel_path = os.path.relpath(fpath, dir_path)
                        dest_path = os.path.join(quarantine_dir, rel_path)
                        dest_folder = os.path.dirname(dest_path)
                        if not os.path.exists(dest_folder):
                            os.makedirs(dest_folder)
                        os.rename(fpath, dest_path)
                        logger.info(f"Moved {fpath} to quarantine (flagged as non-educational)")
                    except Exception as e:
                        logger.error(f"Failed to move {fpath} to quarantine: {e}")
            elif result == "educational":
                logger.info(f"File clean (educational): {fpath}")
            else:
                logger.warning(f"Could not classify {fpath} (Gemini response: {result})")
    logger.info("Scan complete.")

def main():
    scan_and_remove(SCAN_DIR)

if __name__ == "__main__":
    main()
