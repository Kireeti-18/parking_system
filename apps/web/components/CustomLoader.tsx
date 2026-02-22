export function CustomLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="relative rounded-full bg-white w-[90%] max-w-[550px] h-[4px]">
        <div className="absolute bottom-[-1px] z-0 flex w-full items-end justify-between px-0 md:px-1 xl:px-2">
          <img
            src="/building_1.png"
            alt="building"
            className="h-[70px] md:h-[100px] xl:h-[150px] opacity-30"
          />
          <img
            src="/tree_1.png"
            alt="tree"
            className="relative h-[50px] md:h-[70px] xl:h-[100px] -bottom-[5px] opacity-40"
          />
          <img
            src="/building_2.png"
            alt="building"
            className="h-[100px] md:h-[140px] xl:h-[200px] opacity-30"
          />
          <img
            src="/tree_2.png"
            alt="tree"
            className="h-[50px] md:h-[70px] xl:h-[100px] opacity-40"
          />
          <img
            src="/building_3.png"
            alt="building"
            className="h-[75px] md:h-[100px] xl:h-[150px] opacity-30"
          />
        </div>

        <div className="relative">
          <img
            src="/logo.png"
            alt="Motorcycle Loader"
            className="absolute bottom-[-5px] z-10 [--bike-w:60px] md:[--bike-w:80px] xl:[--bike-w:125px] w-[var(--bike-w)] animate-drive"
          />
        </div>
      </div>
    </div>
  );
}
