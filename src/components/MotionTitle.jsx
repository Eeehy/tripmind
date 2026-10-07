// The Chinese heading supplies semantics; this oversized line sets the visual rhythm.
export default function MotionTitle({ words }) {
  return <div className="motion-title" aria-hidden="true">
    {words.map((word, index) => <span className="motion-word-mask" key={word}>
      <span className={`motion-word ${index === words.length - 1 ? 'motion-word-outline' : ''}`}>{word}</span>
    </span>)}
  </div>;
}
