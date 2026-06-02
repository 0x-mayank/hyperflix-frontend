import { FaTimes, FaSearch } from "react-icons/fa";

export default function SearchOverlay({
  isOpen,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="
      fixed
      inset-0
      z-[100]
      bg-black/95
      backdrop-blur-2xl
      flex
      items-start
      justify-center
      pt-40
      animate-fadeIn
      "
    >
      <div
        className="
        w-full
        max-w-[850px]
        px-6
        "
      >
        <div
          className="
          flex
          items-center
          gap-4
          "
        >
          <div
            className="
            flex
            items-center
            gap-4
            flex-1

            bg-[#111111]
            border
            border-white/10

            rounded-2xl

            px-6
            py-5

            shadow-[0_0_50px_rgba(0,0,0,0.5)]
            "
          >
            <FaSearch className="text-white/40" />

            <input
              autoFocus
              type="text"
              placeholder="Search movies, TV shows, anime..."
              className="
              flex-1
              bg-transparent
              outline-none
              text-white
              text-xl
              placeholder:text-white/30
              "
            />
          </div>

          <button
            onClick={onClose}
            className="
            w-14
            h-14

            rounded-2xl

            bg-[#111111]
            border
            border-white/10

            flex
            items-center
            justify-center

            text-white

            hover:bg-red-600
            transition-all
            duration-300
            "
          >
            <FaTimes />
          </button>
        </div>

        <p
          className="
          mt-6
          text-center
          text-white/30
          "
        >
          Start typing to search HyperFlix
        </p>
      </div>
    </div>
  );
}