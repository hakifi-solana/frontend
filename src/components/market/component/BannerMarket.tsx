export default function BannerMarket() {
  return (
    <section className="mt-4 lg:mt-0 flex flex-col lg:flex-row items-center justify-between">
      <div className="lg:ml-5 lg:w-[45%]">
        <h1 className="text-typo-accent text-[28px] lg:text-5xl text-center lg:text-start font-determination font-normal">
          WELCOME TO <br /> HAKIFI MARKET
        </h1>
        <p className=" text-typo-primary text-sm lg:text-xl text-center lg:text-start leading-6 font-medium font-saira mt-1 lg:mt-4">
          Learn Crypto and Blockchain with Hakifi Blog: <br />
          a Free, Comprehensive and Unbiased resource <br />
          for Blockchain knowledge
        </p>
      </div>
      <div className="mt-4 lg:mt-0 lg:w-[55%]">
        <img
          className="w-full h-full object-fill"
          src="/assets/images/market/banner.png"
          alt="Banner"
        />
      </div>
    </section>
  );
}
