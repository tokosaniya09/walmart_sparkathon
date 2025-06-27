# from transformers import AutoTokenizer, AutoModelForCausalLM
# import torch
# import json
# import re  # ✅ Needed for extracting clean JSON from messy output

# # Load Qwen-1.5 Chat model
# model_id = "Qwen/Qwen1.5-1.8B-Chat"
# tokenizer = AutoTokenizer.from_pretrained(model_id, trust_remote_code=True)
# model = AutoModelForCausalLM.from_pretrained(model_id, trust_remote_code=True).eval()

# def extract_json_from_output(text: str) -> dict:
#     """
#     Extract the first valid JSON object from a possibly messy LLM output.
#     """
#     try:
#         matches = re.findall(r'\{(?:[^{}]|(?R))*\}', text, re.DOTALL)
#         for match in reversed(matches):  # try last match first in case multiple JSONs
#             try:
#                 return json.loads(match)
#             except json.JSONDecodeError:
#                 continue
#     except Exception as e:
#         print(f"⚠️ Failed to extract JSON: {e}")
#     return {}

# def classify_product_fields(title: str, description: str) -> dict:
#     prompt = f"""You are an AI assistant that classifies e-commerce products.

# Given the product title and description, classify it into structured fields:
# - sub_category
# - item_type
# - color
# - material

# Respond in JSON format.

# Example input:
# Title: White floral midi skirt
# Description: Soft cotton skirt with elastic waistband, perfect for summer.

# Your response:
# {{
#   "sub_category": "women",
#   "item_type": "skirt",
#   "color": "white",
#   "material": "cotton"
# }}

# Now classify the following:

# Title: {title}
# Description: {description}
# """

#     inputs = tokenizer(prompt, return_tensors="pt")
#     with torch.no_grad():
#         outputs = model.generate(
#             **inputs,
#             max_new_tokens=256,
#             temperature=0.7,
#             do_sample=False
#         )

#     output_text = tokenizer.decode(outputs[0], skip_special_tokens=True)

#     result = extract_json_from_output(output_text)
#     if not result:
#         print(f"⚠️ Failed to parse Qwen output.")
#         print("Output was:", output_text)
#     return result

from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
import json

# Load Qwen-1.5 Chat model
model_id = "Qwen/Qwen1.5-1.8B-Chat"
tokenizer = AutoTokenizer.from_pretrained(model_id, trust_remote_code=True)
model = AutoModelForCausalLM.from_pretrained(model_id, trust_remote_code=True).eval()

def extract_json_from_output(text: str) -> dict:
    """
    Extract the first valid JSON object from a possibly messy LLM output.
    """
    try:
        json_start = text.find("{")
        json_end = text.rfind("}") + 1
        if json_start == -1 or json_end == -1:
            return {}
        json_str = text[json_start:json_end]
        return json.loads(json_str)
    except json.JSONDecodeError as e:
        print(f"⚠️ JSON decode error: {e}")
    return {}

def classify_product_fields(title: str, description: str) -> dict:
    prompt = f"""You are an AI assistant that classifies e-commerce products.

        Given the product title and description, classify it into structured fields:
        - sub_category
        - item_type
        - color
        - material

        Respond **only** with a single JSON object. Do not add any explanation.

        Example input:
        Title: White floral midi skirt
        Description: Soft cotton skirt with elastic waistband, perfect for summer.

        Your response:
        {{
        "sub_category": "women",
        "item_type": "skirt",
        "color": "white",
        "material": "cotton"
        }}

        Now classify the following:

        Title: {title}
        Description: {description}
    """
    inputs = tokenizer(prompt, return_tensors="pt")
    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=256,
            temperature=0.7,
            do_sample=False
        )

    output_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    result = extract_json_from_output(output_text)

    if not result:
        print("⚠️ Failed to parse Qwen output.")
        print("Output was:", output_text)

    return result
