import { MarketPair } from "@/@type/pair.type";
import CoinListWrapper from "@/components/common/Accordion/CoinItem";
import Button from "@/components/common/Button";
import {
  FavoriteFillIcon,
  FavoriteOutlineIcon,
} from "@/components/common/Icons/FavoriteIcon";
import Pagination from "@/components/common/Pagination";
import Spinner from "@/components/common/Spinner";
import { cn } from "@/utils";
import { formatNumber } from "@/utils/format";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Props = {
  listToken: {
    rows: MarketPair[];
    total: number;
  };
  isLoading: boolean;
  symbolFavorites?: { [x: string]: boolean };
  type: "hot" | "favorite";
  handleFavorite?: (symbol: string, isFavorite?: boolean) => void;
};

const PAGE_SIZE = 10;

export default function CoinListFavoriteHot({
  listToken,
  symbolFavorites,
  type,
  handleFavorite,
  isLoading,
}: Props) {
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageChange = (selectedPage: number) => {
    setCurrentPage(selectedPage);
  };

  const paginatedList = listToken.rows.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE
  );
  return (
    <div className="space-y-3">
      {isLoading ? (
        <div className="w-full h-52 relative">
          <Spinner
            className=" absolute top-1/2 left-1/2 !-translate-x-1/2 !-translate-y-1/2"
            size="xs"
          />
        </div>
      ) : (
        paginatedList.map((item) => {
          const gap = item.priceChangePercent;
          const isFavorite =
            symbolFavorites && symbolFavorites[item.symbol] === true;
          return (
            <CoinListWrapper
              key={item.id}
              labelClassName="w-[300px]"
              content={
                <section>
                  <div className="grid grid-cols-2 text-body-12 gap-y-3">
                    <p className="text-typo-secondary text-start">Category</p>
                    <p className="text-typo-accent text-end">{item.category || "----"}</p>
                    <p className="text-typo-secondary text-start">
                      Market Price
                    </p>
                    <p className="text-support-white text-end">
                      ${formatNumber(item.lastPrice, 2)}
                    </p>
                    <p className="text-typo-secondary text-start">24h High</p>
                    <p className="text-support-white text-end">
                      ${formatNumber(item.high, 2)}
                    </p>
                    <p className="text-typo-secondary text-start">24h Low</p>
                    <p className="text-support-white text-end">
                      ${formatNumber(item.low, 2)}
                    </p>
                    <p className="text-typo-secondary text-start">
                      Total Q-Cover
                    </p>
                    <p className="text-support-white text-end">
                      {formatNumber(item.q_covered, 2)}
                    </p>
                    <p className="text-typo-secondary text-start">
                      Total Margin
                    </p>
                    <p className="text-support-white text-end">
                      {formatNumber(item.margin, 2)}
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full mt-4 justify-center"
                  >
                    <Link href={`/buy-cover/${item.symbol}`}>Buy cover</Link>
                  </Button>
                </section>
              }
            >
              <section className="flex items-center justify-between w-full">
                <div className="flex items-center gap-x-3">
                  <div
                    onClick={() =>
                      handleFavorite && handleFavorite(item.symbol, isFavorite)
                    }
                  >
                    {isFavorite || type === "favorite" ? (
                      <FavoriteFillIcon />
                    ) : (
                      <FavoriteOutlineIcon />
                    )}
                  </div>
                  <div className="flex items-center">
                    <Image
                      src={item.token?.attachment}
                      width={24}
                      height={24}
                      alt="logo"
                      className="rounded-full lg:w-6 lg:h-6 w-5 h-5"
                    />
                    <div className="ml-1 text-body-12 flex flex-col items-start">
                      <p>
                        <span className="text-typo-primary">{item.asset} </span>
                        <span className="text-typo-secondary">
                          / {item.unit}
                        </span>
                      </p>
                      <p className="text-xs text-typo-secondary">{item.asset}</p>
                    </div>
                  </div>
                </div>
                <div className="font-saira font-medium">
                  <span className="text-sm text-typo-primary">
                    {formatNumber(item.lastPrice, 2)}
                  </span>
                  <div
                    className={cn("text-xs", {
                      " text-negative": gap < 0,
                      " text-positive": gap >= 0,
                    })}
                  >
                    {gap >= 0 ? "+" : "-"}
                    {formatNumber(Math.abs(gap), 2)}%
                  </div>
                </div>
              </section>
            </CoinListWrapper>
          );
        })
      )}
      <div className="flex justify-center">
        <Pagination
          onPreviousPage={() =>
            currentPage >= 1 && handlePageChange(currentPage - 1)
          }
          canPreviousPage={false}
          onNextPage={() =>
            currentPage < Math.ceil(listToken.total / PAGE_SIZE) - 1 &&
            handlePageChange(currentPage + 1)
          }
          pageIndex={currentPage}
          pageCount={Math.ceil(listToken.total / PAGE_SIZE)}
          canNextPage={false}
          setPageIndex={handlePageChange}
        />
      </div>
    </div>
  );
}
