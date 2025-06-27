from app.utils.product_classify import classify_product_fields

title = "Seasonwood Farmhouse Beige Flowers Light Filtering Rod Pocket Curtains, 59 in x 63 in"
description = "Rating: 4.6 stars (104 reviews)"

print("\n🔍 Sending to model...")
result = classify_product_fields(title, description)

print("\n🧠 Model Output Parsed as:")
print(result)

# Optional: raw model output (unparsed), if you're using a generate function inside
# If classify_product_fields uses a local model and tokenizer, you can extract raw text like this:

from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

model_id = "Qwen/Qwen1.5-1.8B-Chat"
tokenizer = AutoTokenizer.from_pretrained(model_id, trust_remote_code=True)
model = AutoModelForCausalLM.from_pretrained(model_id, trust_remote_code=True).eval()

prompt = f"""
You are an AI assistant that classifies e-commerce products.

Given the product title and description, classify it into structured fields:
- sub_category
- item_type
- color
- material

Respond only with a single JSON object, and no explanation.

Example:
Title: White floral midi skirt
Description: Soft cotton skirt with elastic waistband, perfect for summer.

Response:
{{
  "sub_category": "women",
  "item_type": "skirt",
  "color": "white",
  "material": "cotton"
}}

Now classify the following:

Title: {title}
Description: {description}

Response:
"""

inputs = tokenizer(prompt, return_tensors="pt")
with torch.no_grad():
    outputs = model.generate(**inputs, max_new_tokens=256, do_sample=False, temperature=0.7)

raw_output = tokenizer.decode(outputs[0], skip_special_tokens=True)

print("\n📄 Raw model output:")
print(raw_output)
