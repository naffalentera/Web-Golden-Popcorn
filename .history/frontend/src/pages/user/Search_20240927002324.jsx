


  return (
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1 d-flex">
          <Filter onFilterChange={handleFilterChange} />
          <div className="col-md-10 mt-3">
            <div className="d-flex justify-content-end gap-2 align-items-center mb-3">
              <label htmlFor="sort" className="form-label mb-0">Sorted by:</label>
              <select id="sort" className="form-select w-auto" value={sortBy} onChange={handleSortChange}>
                <option value="alphabetics-az">Alphabetics A-Z</option>
                <option value="alphabetics-za">Alphabetics Z-A</option>
                <option value="rating">Rating</option>
                <option value="year-asc">Year (Oldest to Newest)</option>
                <option value="year-desc">Year (Newest to Oldest)</option>
              </select>
            </div>
            {query ? (
                <>
                    <p className="mb-4 text-center">
                        Showing results for: <span className="text" style={{ color: '#E50914' }}>{query}</span>
                    </p>
                    <MovieGrid movies={sortedMovies} />
                </>
            ) : (
                <p className="text-center">Please enter a keyword to search for movies.</p>
            )}
          </div>
        </main>
        <Footer />
    </div>
  );
};

export default SearchPage;
