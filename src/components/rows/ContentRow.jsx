import PosterCard from "../cards/PosterCard";

export default function ContentRow({
  title,
  items,
  type,
}) {
  return (
    <section className="mb-12">
      <h2
        className="
        text-2xl
        font-bold
        mx-4
        mb-5
        "
      >
        {title}
      </h2>

      <div
        className="
        flex
        gap-5
        overflow-x-auto
        scrollbar-hide
        py-6
        px-5
        "
      >
        {items.map((item) => (
          <PosterCard
            key={item.id}
            item={item}
            type={type}
          />
        ))}
      </div>
    </section>
  );
}