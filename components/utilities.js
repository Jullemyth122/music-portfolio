const linkedimage = [
    "https://planetary2-jullemyth122.vercel.app/",
    "https://blocks3d-jullemyth122.vercel.app",
    "https://honeycomebear-3d-jullemyth122.vercel.app/",
    "https://quintuplets-jullemyth122.vercel.app/",
    "https://over-laying-jullemyth122.vercel.app/",
    "https://pixelopenwave.vercel.app/",
    "https://kaze-3d-web-jullemyth122.vercel.app/",
    "https://wedding-design-ghyijuial-jullemyth122.vercel.app/",
    "https://hololivedesigns-jullemyth122.vercel.app/",
    "https://philippinewebsite.vercel.app/",
    "https://portfolio-6-version-gundam-jullemyth122.vercel.app/",
    "https://brand-design-jullemyth122.vercel.app",
    "https://3d-gallery-portfolio.vercel.app/"
]
export const images = 
    Array
    .from({length:13})
    .map((elem,i) => ({ url: `/slides/p${(i+1)}.png`,links: linkedimage[i] }))