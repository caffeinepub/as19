export default function CreatedByBanner() {
  return (
    <div className="w-full flex justify-center py-3 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-b border-primary/20">
      <div className="text-center">
        <p className="text-lg md:text-xl font-bold tracking-wide">
          <span className="bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 bg-clip-text text-transparent drop-shadow-sm">
            Created By Azad
          </span>
        </p>
      </div>
    </div>
  );
}
