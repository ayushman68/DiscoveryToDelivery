import json
import random

models_pool = [
    {"name": "Runway Gen-3 Alpha", "category": "Video Gen", "badge": "Verified Pro"},
    {"name": "Flux.1 Pro", "category": "Image Gen", "badge": "Verified Pro"},
    {"name": "ComfyUI Custom Nodes", "category": "Workflow Engine", "badge": "Workflow Verified"},
    {"name": "Kling 1.5 Pro", "category": "Video Gen", "badge": "Verified Pro"},
    {"name": "Midjourney v6.1", "category": "Image Gen", "badge": "Verified Pro"},
    {"name": "ElevenLabs v2", "category": "Audio AI", "badge": "Voice & SFX"},
    {"name": "Topaz Video AI 5", "category": "Upscaling", "badge": "4K 60fps Pipeline"},
    {"name": "DaVinci Resolve Studio", "category": "Post-Production", "badge": "ACES Color Pipeline"},
    {"name": "AnimateDiff v3", "category": "Motion Synthesis", "badge": "Latent Motion"},
    {"name": "ControlNet Multi-Depth", "category": "3D Guidance", "badge": "Spatial Geometry"}
]

specs = [
    "Cinematic Commercials & Brand Teasers",
    "Short-form Viral Video & TikTok 9:16",
    "3D Hard Surface & Automotive VFX",
    "Virtual Fashion & Virtual Garment CAD",
    "Cosmetics & Macro Diffusion Glow",
    "Sci-Fi & Cyberpunk Worldbuilding",
    "Anime & Stylized Motion Animation",
    "Food & Beverage Hyper-Kinetic Teasers",
    "Architectural Visualization & Biophilic Spaces",
    "Audiovisual Music Video & Latent Sync"
]

creators_data = [
    ("Elena Rostova", "@elena_ai_cinema", "Cinematic AI Filmmaker & Commercial Director", "Berlin / Remote", 4.98, 48, 52, 140, 3, "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80", "Dual RTX 4090 24GB VRAM | Fast NVMe Scratch Cache | 10GbE Fiber Pipeline"),
    ("Marcus Vance", "@marcus_comfy_vfx", "ComfyUI VFX Architect & Node Pipeline Engineer", "London / Remote", 4.95, 36, 44, 150, 4, "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80", "Dual NVIDIA RTX 6000 Ada 48GB VRAM | Threadripper PRO 64-Core"),
    ("Sofia Chen", "@sofia_generative", "Virtual 3D & Architectural Diffusion Artist", "Tokyo / Remote", 4.97, 42, 49, 135, 3, "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80", "RTX 4090 24GB | 64GB DDR5 | ColorEdge CG319X calibrated monitor"),
    ("Kai Sterling", "@kai_motion_ai", "Short-Form Viral AI Animator & Kinetic Specialist", "Los Angeles / Remote", 4.92, 54, 68, 125, 2, "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80", "RTX 4090 Mobile Workstation + Cloud Tensor Cluster A100"),
    ("Aisha Patel", "@aisha_virtual_couture", "AI Fashion Couturier & CLO3D Virtual Stylist", "Paris / Remote", 4.99, 31, 38, 160, 4, "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80", "Dual RTX 4090 24GB VRAM | CLO3D Enterprise | OptiTrack Studio"),
    ("Liam O Connor", "@liam_sound_latent", "Audiovisual Sync & Generative Sound Architect", "Dublin / Remote", 4.94, 28, 35, 130, 3, "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80", "Universal Audio Apollo x8 | Genelec 8351B Studio Monitors | RTX 4090"),
    ("Zara Thorne", "@zara_cyberpunk", "Cyberpunk & Sci-Fi Worldbuilding Concept Lead", "Singapore / Remote", 4.96, 39, 46, 145, 4, "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80", "RTX 4090 24GB | Wacom Cintiq Pro 27 | 128GB RAM"),
    ("Mateo Rossi", "@mateo_auto_vfx", "Automotive AI Commercials & Hard Surface Director", "Milan / Remote", 4.97, 44, 51, 155, 4, "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80", "Dual RTX 4090 48GB VRAM | Unreal Engine 5.4 ControlNet rig"),
    ("Chloe Dubois", "@chloe_macro_glow", "Luxury Cosmetics & Macro Diffusion Stylist", "Zurich / Remote", 4.98, 35, 40, 140, 3, "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80", "Dual RTX 4090 | Phase One XF IQ4 calibrated workflow"),
    ("Kenji Takahashi", "@kenji_anime_latent", "Anime & Stylized Generative Animator", "Kyoto / Remote", 4.93, 62, 74, 120, 2, "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80", "RTX 4090 24GB | AnimateDiff custom LoRA cluster"),
    ("Sarah Jenkins", "@sarah_food_ai", "Food & Beverage Kinetic Pour AI Specialist", "New York / Remote", 4.95, 33, 41, 135, 3, "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80", "RTX 4090 24GB | Phantom Flex 4K emulation prompt engine"),
    ("Viktor Novak", "@viktor_lora_lab", "Product Consistency & Custom LoRA Engineer", "Prague / Remote", 4.99, 58, 65, 165, 3, "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80", "4x RTX 4090 Cluster | Kohya-ss & ComfyUI dedicated servers"),
    ("Priya Sharma", "@priya_heritage_ai", "Documentary & Cultural Heritage AI Filmmaker", "Mumbai / Remote", 4.94, 27, 34, 125, 4, "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80", "RTX 4090 | 64GB DDR5 | Blackmagic Pocket Cinema ACES"),
    ("Lucas Silva", "@lucas_music_latent", "Music Video Director & Audiovisual Flow Lead", "Sao Paulo / Remote", 4.96, 47, 59, 130, 3, "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=400&q=80", "RTX 4090 24GB | Ableton Live 12 + ComfyUI OSC automation"),
    ("Nina Kowalski", "@nina_virtual_aces", "Virtual Production & ACES Cinematic Colorist", "Warsaw / Remote", 4.97, 38, 45, 140, 3, "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80", "DaVinci Resolve Studio Advanced Panel | Dual RTX 4090"),
    ("David Kim", "@david_worldbuilder", "Generative Environment & Game Unreal Artist", "Seoul / Remote", 4.95, 40, 48, 145, 4, "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80", "Unreal Engine 5.4 Nanite-Lumen + Flux.1 Pro Depth pipeline"),
    ("Maya Lin", "@maya_typography_ai", "Generative Typography & Motion Identity Lead", "San Francisco / Remote", 4.98, 29, 36, 150, 2, "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80", "Apple M3 Max 128GB + Cloud H100 GPU cluster"),
    ("Julian Mercer", "@julian_bio_macro", "Biophilic & Micro-Diffusion Medical Animator", "Boston / Remote", 4.99, 22, 29, 170, 5, "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80", "Dual RTX 6000 Ada 48GB | Houdini Solaris Bio-Diffusion"),
    ("Fatima Al-Mansoor", "@fatima_arch_ai", "Futuristic Architecture & Urbanism Visualizer", "Dubai / Remote", 4.96, 37, 43, 145, 4, "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80", "Rhino 8 + Grasshopper + Flux ControlNet pipeline"),
    ("Oliver Bennett", "@oliver_surreal_art", "Surrealist Editorial & High-Concept Art Director", "Stockholm / Remote", 4.93, 34, 42, 135, 3, "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80", "Hasselblad H6D-100c emulation + Midjourney v6.1 RAW"),
    ("Gabriel Santos", "@gabriel_sports_ai", "Dynamic Sports & Extreme Motion AI Director", "Barcelona / Remote", 4.95, 49, 58, 130, 2, "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80", "Runway Gen-3 Alpha Camera Track + Topaz 60fps interpolation"),
    ("Hana Becker", "@hana_procedural_vfx", "Procedural VFX & Fluid Simulation Generative Artist", "Munich / Remote", 4.98, 26, 33, 155, 4, "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80", "EmberGen + ComfyUI AnimateDiff fluid velocity mapping"),
    ("Ronald Chen", "@ronald_brand_scale", "Enterprise AI Commercial Production Supervisor", "Toronto / Remote", 4.97, 65, 78, 160, 3, "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80", "Enterprise AWS Bedrock + ComfyUI dedicated farm"),
    ("Leila Farah", "@leila_character_lora", "Photorealistic Character & Digital Double Specialist", "Beirut / Remote", 4.99, 41, 48, 150, 3, "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80", "InstantID + FaceID LoRA Multi-Angle consistency rig"),
    ("Samira Khan", "@samira_brand_ident", "Generative Visual Identity & Packaging Innovator", "London / Remote", 4.94, 30, 37, 135, 3, "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80", "Adobe Illustrator + Flux.1 Pro SVG vector guidance"),
    ("Alexander Wright", "@alex_period_cinema", "Historical & Period Drama Generative Cinematographer", "Edinburgh / Remote", 4.96, 25, 32, 140, 5, "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80", "Cooke Anamorphic /i Full Frame Plus look LoRAs"),
    ("Zoe Martinez", "@zoe_tiktok_hooks", "Gen-Z Viral Hooks & 9:16 Kinetic Cutdowns Lead", "Miami / Remote", 4.93, 73, 89, 120, 1, "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80", "CapCut Pro + Kling 1.5 Vertical 9:16 rapid pipeline"),
    ("Eric Johansson", "@eric_nordic_glow", "Nordic Minimalist & Biophilic Brand Stylist", "Oslo / Remote", 4.98, 32, 39, 145, 3, "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=400&q=80", "Travertine & Natural Light Diffusion LoRA architecture"),
    ("Mei Ling Zhao", "@meiling_clay_motion", "Mixed-Media & Stop-Motion Generative Artist", "Hong Kong / Remote", 4.95, 36, 44, 130, 3, "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80", "Custom Claymation Texture LoRAs + 12fps frame modulation"),
    ("Jasper Vance", "@jasper_hologram_vfx", "Volumetric Holographic & Spatial Computing Creator", "Austin / Remote", 4.99, 21, 28, 175, 4, "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80", "Looking Glass Pro Holographic display + NeRF Gaussian Splatting")
]

portfolio_images = [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80"
]

creators = []
for i, c in enumerate(creators_data):
    cid = f"creator-{i+1}"
    spec = specs[i % len(specs)]
    tools_selected = random.sample(models_pool, 5)
    
    aspect = "16:9" if i % 2 == 0 else "9:16"
    content_name = "Cinematic Video (16:9)" if i % 2 == 0 else "Short-form Social (9:16)"
    img_url = portfolio_images[i % len(portfolio_images)]
    
    port1 = {
        "id": f"port-{i+1}-1",
        "title": f"{c[0].split()[0]} Showcase: Commercial Master Render",
        "content_type": content_name,
        "media_url": img_url,
        "thumbnail": img_url,
        "aspect_ratio": aspect,
        "client": f"Enterprise Client #{i+101}",
        "duration": "0:30",
        "views": f"{random.randint(40, 480)}k",
        "description": f"High-impact generative visual campaign produced with {tools_selected[0]['name']} and {tools_selected[1]['name']}. Features frame-accurate consistency and 4K upscaling.",
        "ai_breakdown": {
            "primary_models": [tools_selected[0]["name"], tools_selected[1]["name"], "DaVinci Resolve ACES"],
            "prompt_used": f"Hero commercial master shot of futuristic luxury concept, volumetric cinematic lighting, photorealistic textures, 8k resolution, shot on Arri Alexa 65 anamorphic lenses, natural reflections --ar {aspect} --style raw",
            "negative_prompt": "cartoon, low quality, artifacts, blur, oversaturated bloom, deformed geometry",
            "seed": random.randint(1000000000, 9999999999),
            "sampler": "Euler Ancestral / DPM++ 2M Karras",
            "cfg_scale": round(random.uniform(5.5, 7.5), 1),
            "steps": random.choice([35, 45, 50]),
            "upscale_pipeline": "Topaz Video AI 5 Iris-HQ 4K 60fps",
            "workflow_file": f"workflow_node_graph_creator_{i+1}.json"
        }
    }

    creator_obj = {
        "id": cid,
        "name": c[0],
        "handle": c[1],
        "title": c[2],
        "avatar": c[9],
        "cover_image": portfolio_images[(i+1) % len(portfolio_images)],
        "bio": f"Specializing in {spec.lower()}. Delivering verified prompt reproducibility, model indemnity clearance, and commercial-grade generative assets for global brands.",
        "location": c[3],
        "rating": c[4],
        "review_count": c[5],
        "completed_projects": c[6],
        "hourly_rate": c[7],
        "avg_turnaround_days": c[8],
        "verification": {
            "verified_creator": True,
            "verified_tool_stack": True,
            "workflow_provenance_verified": True,
            "commercial_license_cleared": True,
            "kampus_vc_fellow": (i % 3 == 0),
            "trust_score": random.randint(96, 100)
        },
        "skills": [spec.split()[0], "Prompt Engineering", "ComfyUI Custom Nodes", "Character Consistency", "Color Grading"],
        "specialization": spec,
        "content_types": ["Cinematic Video (16:9)", "Short-form Social (9:16)", "Editorial Still (4:5)"],
        "tools": tools_selected,
        "hardware_specs": c[10],
        "commercial_terms": {
            "license_type": "Full Buyout & Ad Rights",
            "model_indemnity_included": True,
            "max_revisions_included": 3,
            "workflow_files_included": True
        },
        "portfolio": [port1]
    }
    creators.append(creator_obj)

import os
target_file = r"C:\Users\hp\Desktop\DiscoveryToDelivery\data\creators.json"
with open(target_file, "w", encoding="utf-8") as f:
    json.dump(creators, f, indent=2, ensure_ascii=False)

print(f"Successfully generated {len(creators)} rich creators in {target_file}")
