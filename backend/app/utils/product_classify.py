from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
import json

# Load Qwen-1.5 Chat model
model_id = "Qwen/Qwen1.5-1.8B-Chat"
tokenizer = AutoTokenizer.from_pretrained(model_id, trust_remote_code=True)
model = AutoModelForCausalLM.from_pretrained(model_id, trust_remote_code=True).eval()

def classify_product_fields(title: str, description: str) -> dict:
    prompt = f"""You are an AI assistant that classifies e-commerce products.

Given the product title and description, classify it into structured fields:
- sub_category
- item_type
- color
- material

Respond in JSON format.

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
    
    # Extract JSON from model output
    try:
        json_start = output_text.find("{")
        json_str = output_text[json_start:]
        result = json.loads(json_str)
        return result
    except Exception as e:
        print(f"⚠️ Failed to parse Qwen output: {e}")
        print("Output was:", output_text)
        return {}
