import clsx from 'clsx';
import ChevronIcon from '../Icons/ChevronIcon';

type TProps = {
	onPreviousPage: () => void;
	canPreviousPage: boolean;
	onNextPage: () => void;
	pageIndex: number;
	pageCount: number;
	canNextPage: boolean;
	setPageIndex: (page: number) => void;
	limit?: number;
};

const Pagination = ({
	onPreviousPage,
	onNextPage,
	canNextPage,
	canPreviousPage,
	pageCount,
	pageIndex,
	setPageIndex,
	limit = 10,
}: TProps) => {
  const { totalPages, startPage, endPage, pages } = GetPager(
    pageCount * 10,
    pageIndex,
    10,
    5
  );
  if (totalPages <= 1) return null;
  return (
    <section className="flex w-full justify-end">
      <div
        className={clsx(
          'mt-4 flex w-fit items-center justify-end  text-typo-secondary px-2 py-1 gap-x-1 text-sm',
          { 'pointer-events-none': totalPages <= 1 },
        )}>
        <button
          // variant="outline"
          className="h-6 w-6"
          onClick={onPreviousPage}
          disabled={canPreviousPage}>
          <ChevronIcon
            className={clsx(
              'h-6 w-6 rotate-90 border-support-scroll border !bg-support-black',
              canPreviousPage? 'opacity-30' : 'hover:cursor-not-allowed',
            )}
          />
        </button>

        {startPage > 1 && (
          <>
            <button
              className={clsx('!bg-support-black text-typo-secondary border-support-scroll hover:border-typo-accent border  h-6 w-6', {
                '!text-typo-accent !border-typo-accent': pageIndex + 1 === 1,
              })}
              onClick={() => setPageIndex(0)}>
              1
            </button>
            {startPage > 2 && <div>...</div>}
          </>
        )}
        {pages.map((page, index) => {
          const isSelected = pageIndex + 1 === page;
          return (
            <button
              key={index}
              className={clsx('!bg-support-black text-typo-secondary border border-support-scroll hover:border-typo-accent hover:text-typo-accent h-6 w-6', {
                '!text-typo-accent !border-typo-accent': isSelected,
              })}
              onClick={() => setPageIndex(page - 1)}>
              {page}
            </button>
          );
        })}
        {endPage < totalPages - 1 && <div>...</div>}
        {endPage < totalPages && (
          <>
            <button
              className={clsx('!bg-support-black text-typo-secondary border border-support-scroll min-h-6 min-w-6 hover:text-typo-accent', {
                ' !border-typo-accent !text-typo-accent': pageIndex === totalPages,
              })}
              onClick={() => setPageIndex(totalPages)}>
              {totalPages}
            </button>
          </>
        )}

        <button
          // variant="outline"
          className={clsx("h-6 w-6 border border-support-scroll", {
          "hover:border-typo-accent": canNextPage,
          "hover:cursor-not-allowed": !canNextPage
          
          })}
          onClick={onNextPage}
          disabled={canNextPage}>
          <ChevronIcon
            className={clsx('h-6 w-6 -rotate-90', canNextPage && 'opacity-30')}
          />
        </button>
      </div>
    </section>
  );
};
function GetPager(
  totalItems: number,
  currentPage: number,
  pageSize: number,
  paginationSize: number
) {
	const distance = Math.floor(paginationSize / 2);
	currentPage = currentPage || 1;

	const totalPages = Math.ceil(totalItems / pageSize);

	let startPage, endPage;

	if (totalPages <= paginationSize) {
		startPage = 1;
		endPage = totalPages;
	} else {
		if (currentPage <= Math.ceil(paginationSize / 2)) {
			startPage = 1;
			endPage = paginationSize;
		} else if (currentPage + distance >= totalPages) {
			startPage = totalPages - (paginationSize - 1);
			endPage = totalPages;
		} else {
			startPage = currentPage - distance;
			endPage = currentPage + distance;
		}
	}

	const pages = [];
	for (let i = startPage; i <= endPage; i++) {
		pages.push(i);
	}

	return {
		totalPages,
		startPage,
		endPage,
		pages,
	};
}

export default Pagination;
