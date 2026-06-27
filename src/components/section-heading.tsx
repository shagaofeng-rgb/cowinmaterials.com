type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  intro?: string;
};

export function SectionHeading({ eyebrow, title, intro }: SectionHeadingProps) {
  return (
    <div className="section-heading">
      {eyebrow ? <span>{eyebrow}</span> : null}
      <h1>{title}</h1>
      {intro ? <p>{intro}</p> : null}
    </div>
  );
}
