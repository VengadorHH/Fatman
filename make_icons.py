#!/usr/bin/env python3
"""Zeichnet das Fettschmelzer-Logo (fetter Batman im zu engen Kostüm) als PNG-Icons."""
from PIL import Image, ImageDraw
import math, os

def lerp(a, b, t): return tuple(int(a[i] + (b[i]-a[i])*t) for i in range(3))

def draw_logo(S):
    """Zeichnet das Logo auf Canvas der Kantenlänge S (mit Supersampling)."""
    ss = 4
    W = S * ss
    img = Image.new("RGBA", (W, W), (0,0,0,0))
    d = ImageDraw.Draw(img)
    def px(v): return int(v/512*W)  # Koordinaten aus 512er-Design skalieren

    # --- Hintergrund: abgerundetes Quadrat mit Vertikal-Verlauf ---
    bg_top = (42,51,80); bg_bot = (13,17,23)
    grad = Image.new("RGBA",(W,W),(0,0,0,0))
    gd = ImageDraw.Draw(grad)
    for y in range(W):
        t = y/W
        gd.line([(0,y),(W,y)], fill=lerp(bg_top,bg_bot,t)+(255,))
    mask = Image.new("L",(W,W),0)
    md = ImageDraw.Draw(mask)
    md.rounded_rectangle([0,0,W-1,W-1], radius=px(112), fill=255)
    img.paste(grad,(0,0),mask)
    d = ImageDraw.Draw(img)

    # --- Glow hinter Figur ---
    glow = Image.new("RGBA",(W,W),(0,0,0,0))
    gld = ImageDraw.Draw(glow)
    cx,cy,r = px(256),px(252),px(205)
    for i in range(40,0,-1):
        a = int(30*(i/40)**2)
        rr = int(r*i/40)
        gld.ellipse([cx-rr,cy-rr,cx+rr,cy+rr], fill=(255,209,92,a))
    img = Image.alpha_composite(img, glow)
    d = ImageDraw.Draw(img)

    suit_top=(50,59,92); suit_bot=(20,26,43)
    suit_mid=(38,45,70)

    # --- Cape-Zipfel (klein, gespannt) ---
    d.polygon([(px(150),px(305)),(px(120),px(400)),(px(140),px(442)),
               (px(178),px(405)),(px(170),px(340))], fill=(15,20,34,255))
    d.polygon([(px(362),px(305)),(px(392),px(400)),(px(372),px(442)),
               (px(334),px(405)),(px(342),px(340))], fill=(15,20,34,255))

    # --- kleine Ärmchen ---
    for sx,rot in [(126,-16),(386,16)]:
        arm = Image.new("RGBA",(W,W),(0,0,0,0))
        ad = ImageDraw.Draw(arm)
        ad.ellipse([px(sx-30),px(332-44),px(sx+30),px(332+44)], fill=suit_mid+(255,))
        arm = arm.rotate(-rot, center=(px(sx),px(332)))
        img = Image.alpha_composite(img,arm)
    d = ImageDraw.Draw(img)
    d.ellipse([px(108-21),px(366-21),px(108+21),px(366+21)], fill=(26,32,56,255))
    d.ellipse([px(404-21),px(366-21),px(404+21),px(366+21)], fill=(26,32,56,255))

    # --- dicker runder Körper (mit vertikalem Verlauf via Streifen) ---
    body = Image.new("RGBA",(W,W),(0,0,0,0))
    bd = ImageDraw.Draw(body)
    bx,by,brx,bry = px(256),px(342),px(152),px(130)
    bd.ellipse([bx-brx,by-bry,bx+brx,by+bry], fill=(255,255,255,255))
    bodymask = body.split()[3]
    bodygrad = Image.new("RGBA",(W,W),(0,0,0,0))
    bgd = ImageDraw.Draw(bodygrad)
    for y in range(by-bry, by+bry):
        t = (y-(by-bry))/(2*bry)
        bgd.line([(0,y),(W,y)], fill=lerp(suit_top,suit_bot,t)+(255,))
    img.paste(bodygrad,(0,0),bodymask)
    d = ImageDraw.Draw(img)

    # Nähte / spannende Nähte
    def arc_path(x1,y1,cx_,cy_,x2,y2,steps=30):
        pts=[]
        for i in range(steps+1):
            t=i/steps
            xx=(1-t)**2*x1+2*(1-t)*t*cx_+t**2*x2
            yy=(1-t)**2*y1+2*(1-t)*t*cy_+t**2*y2
            pts.append((xx,yy))
        return pts
    seam=(77,90,134)
    d.line([ (px(x),px(y)) for x,y in arc_path(180,302,256,334,332,302)], fill=seam+(180,), width=px(3), joint="curve")
    d.line([ (px(x),px(y)) for x,y in arc_path(172,372,256,406,340,372)], fill=seam+(180,), width=px(3), joint="curve")
    d.line([(px(256),px(230)),(px(256),px(410))], fill=(12,17,32,140), width=px(6))
    for yy in (300,336,372):
        d.ellipse([px(252),px(yy-4),px(260),px(yy+4)], fill=(245,177,0,255))

    # --- gespanntes Bat-Emblem auf der Brust (breit, symmetrisch) ---
    bat = Image.new("RGBA",(W,W),(0,0,0,0))
    btd = ImageDraw.Draw(bat)
    ecx,ecy = 256,322
    sx_, sy_ = 2.2, 1.15   # breit gestaucht = spannt über den Bauch
    # rechte Hälfte der Fledermaus (Design-Koords, um 0,0), wird gespiegelt
    right = [
        (0,-16),      # oben Mitte (Kopf-Einkerbung unten)
        (6,-20),      # Ohr innen
        (10,-10),     # Ohrspitze
        (14,-18),
        (18,-6),      # Flügelansatz
        (30,-12),     # oberer Flügelbogen
        (44,-6),      # Flügelspitze außen
        (36,2),
        (44,8),       # untere Flügelspitze
        (30,6),
        (20,12),      # Scallop
        (12,6),
        (8,16),       # unterer Scallop innen
        (2,8),
        (0,12),       # unten Mitte
    ]
    left = [(-x,y) for x,y in reversed(right)]
    bat_pts = right + left
    poly = [(px(ecx+x*sx_), px(ecy+y*sy_)) for x,y in bat_pts]
    btd.polygon(poly, fill=(255,209,92,255))
    img = Image.alpha_composite(img,bat)
    d = ImageDraw.Draw(img)

    # --- Gürtel schneidet in den Bauch ---
    belt_top=(255,226,122); belt_bot=(245,177,0)
    beltimg = Image.new("RGBA",(W,W),(0,0,0,0))
    beld = ImageDraw.Draw(beltimg)
    beld.rounded_rectangle([px(148),px(394),px(364),px(422)], radius=px(14), fill=(255,255,255,255))
    beltmask = beltimg.split()[3]
    beltgrad=Image.new("RGBA",(W,W),(0,0,0,0))
    bgd2=ImageDraw.Draw(beltgrad)
    for y in range(px(394),px(422)):
        t=(y-px(394))/(px(422)-px(394))
        bgd2.line([(0,y),(W,y)], fill=lerp(belt_top,belt_bot,t)+(255,))
    img.paste(beltgrad,(0,0),beltmask)
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([px(236),px(394),px(276),px(422)], radius=px(7), fill=(224,155,0,255))
    d.ellipse([px(192),px(402),px(204),px(414)], fill=(224,155,0,255))
    d.ellipse([px(308),px(402),px(320),px(414)], fill=(224,155,0,255))

    # --- Kopf mit Kapuze + Ohren ---
    d.polygon([(px(196),px(132)),(px(180),px(62)),(px(228),px(116))], fill=suit_mid+(255,))
    d.polygon([(px(316),px(132)),(px(332),px(62)),(px(284),px(116))], fill=suit_mid+(255,))
    headimg=Image.new("RGBA",(W,W),(0,0,0,0))
    hd=ImageDraw.Draw(headimg)
    hx,hy,hrx,hry=px(256),px(190),px(88),px(82)
    hd.ellipse([hx-hrx,hy-hry,hx+hrx,hy+hry], fill=(255,255,255,255))
    headmask=headimg.split()[3]
    headgrad=Image.new("RGBA",(W,W),(0,0,0,0))
    hgd=ImageDraw.Draw(headgrad)
    for y in range(hy-hry,hy+hry):
        t=(y-(hy-hry))/(2*hry)
        hgd.line([(0,y),(W,y)], fill=lerp(suit_top,suit_bot,t)+(255,))
    img.paste(headgrad,(0,0),headmask)
    d=ImageDraw.Draw(img)

    # --- Gesicht: untere Gesichtshälfte als Haut, Kapuze endet auf Augenhöhe ---
    skin=(232,185,143); skin2=(217,168,120)
    # Wange/Kinn-Fläche: großer Halbkreis unterhalb der Augen
    d.chord([px(190),px(150),px(322),px(268)], 8,172, fill=skin+(255,))
    # Doppelkinn als zweiter, schmalerer Bogen
    d.chord([px(212),px(214),px(300),px(276)], 10,170, fill=skin2+(255,))
    # pausbäckige Wangenschatten
    d.ellipse([px(206),px(206),px(238),px(240)], fill=skin+(255,))
    d.ellipse([px(274),px(206),px(306),px(240)], fill=skin+(255,))
    # Mund (leichtes Lächeln)
    d.arc([px(234),px(220),px(278),px(244)], 15,165, fill=(150,92,58,255), width=px(5))
    # kleine Nase
    d.ellipse([px(250),px(206),px(262),px(216)], fill=skin2+(255,))

    # --- Maske: Augenschlitze (weiße Batman-Augen, schräg) ---
    def eye(cx0, flip):
        # weißer, schräg nach außen ansteigender Schlitz
        pts = [(cx0-18,4),(cx0+16,-8),(cx0+20,-2),(cx0-14,12)]
        if flip: pts = [(2*cx0-x, y) for x,y in pts]
        return [(px(px_x), px(188+px_y)) for px_x,px_y in pts]
    d.polygon(eye(238,False), fill=(243,240,231,255))
    d.polygon(eye(274,True),  fill=(243,240,231,255))

    return img.resize((S,S), Image.LANCZOS)

sizes = [16,32,48,72,96,120,144,152,167,180,192,256,384,512,1024]
os.makedirs("icons", exist_ok=True)
master = draw_logo(1024)
master.save("icons/icon-1024.png")
for s in sizes:
    if s==1024: continue
    draw_logo(s if s>=72 else 72).resize((s,s),Image.LANCZOS).save(f"icons/icon-{s}.png")
# Maskable (mit Safe-Zone-Padding: Logo auf 80% verkleinert, zentriert)
for s in [192,512]:
    base = Image.new("RGBA",(s,s),(13,17,23,255))
    inner = draw_logo(int(s*0.8))
    off = (s-inner.width)//2
    base.paste(inner,(off,off),inner)
    base.save(f"icons/maskable-{s}.png")
# Favicon (mehrere Größen in einer .ico)
draw_logo(64).save("/home/claude/repo/favicon.ico", sizes=[(16,16),(32,32),(48,48)])
# Apple touch icon
draw_logo(180).save("icons/apple-touch-icon.png")
print("Icons erstellt:")
for f in sorted(os.listdir("icons")):
    print("  icons/"+f)
