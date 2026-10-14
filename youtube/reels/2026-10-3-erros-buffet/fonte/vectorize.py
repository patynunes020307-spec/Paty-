import sys, numpy as np, potrace
from PIL import Image, ImageFilter
src, out = sys.argv[1], sys.argv[2]
K = 8
a = Image.open(src).convert('RGBA').getchannel('A')
a = a.resize((a.width*K, a.height*K), Image.LANCZOS).filter(ImageFilter.GaussianBlur(K*0.35))
bm = potrace.Bitmap(np.array(a) <= 110)
plist = bm.trace(turdsize=40, alphamax=1.0, opticurve=True, opttolerance=0.2)
d = []
for c in plist:
    s = c.start_point; d.append(f"M{s.x:.1f},{s.y:.1f}")
    for seg in c.segments:
        if seg.is_corner:
            d.append(f"L{seg.c.x:.1f},{seg.c.y:.1f}L{seg.end_point.x:.1f},{seg.end_point.y:.1f}")
        else:
            d.append(f"C{seg.c1.x:.1f},{seg.c1.y:.1f} {seg.c2.x:.1f},{seg.c2.y:.1f} {seg.end_point.x:.1f},{seg.end_point.y:.1f}")
    d.append("Z")
W, H = a.size
open(out,'w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}"><path fill-rule="evenodd" fill="currentColor" d="{"".join(d)}"/></svg>')
print(W, H, len(plist))
