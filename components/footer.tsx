export default function Footer() {
    return (
    <footer id="footer" className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
    <p>
    Made by{" "}
    <a
        href="https://jessicaiacovozzi.vercel.app/"
        target="_blank"
        className="font-bold hover:underline"
        rel="noreferrer"
        aria-label="Jessica Iacovozzi (opens my portfolio in a new tab)"
    >
        Jessica Iacovozzi
    </a>
    </p>
    </footer>
    );
}