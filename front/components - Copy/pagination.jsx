// Pagination.jsx
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <nav className="flex justify-center mt-6">
      <ul className="inline-flex items-center -space-x-px">
        <li>
          <button
            className="px-3 py-1 rounded-l border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
        </li>
        {pages.map((page) => (
          <li key={page}>
            <button
              className={`px-3 py-1 border border-gray-300 bg-white hover:bg-gray-100 ${
                currentPage === page ? "bg-primary text-white" : ""
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          </li>
        ))}
        <li>
          <button
            className="px-3 py-1 rounded-r border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;