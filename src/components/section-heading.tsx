type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  intro?: string;
  level?: 1 | 2;
};

export function SectionHeading({ title, intro, level = 2 }: SectionHeadingProps) {
  const Heading = level === 1 ? "h1" : "h2";
  return (
    <div className="section-heading">
      <Heading>{title}</Heading>
      {intro ? <p>{intro}</p> : null}
    </div>
  );
}
