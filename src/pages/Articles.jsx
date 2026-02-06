import { useEffect, useState } from "react";
import api from "../services/api";
import ArticleCard from "../components/ArticleCard";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("likes");
  const [page, setPage] = useState(1);

  const itemsPerPage = 5;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await api.get("/articles");
        setArticles(res.data);
      } catch (error) {
        console.error("Erro ao buscar artigos:", error);
      }
    };

    fetchArticles();
  }, []);

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const likeArticle = async (id) => {
    try {
      await api.post(`/articles/${id}/like`);
      
      const res = await api.get("/articles");
      setArticles(res.data);
    } catch (error) {
      console.error("Erro ao curtir artigo:", error);
    }
  };

  let filtered = articles.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  if (sort === "likes") {
    filtered.sort((a, b) => b.likes - a.likes);
  }

  if (sort === "az") {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  }

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedArticles = filtered.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="container">
      <h2>Articles</h2>

      <SearchBar search={search} setSearch={handleSearch} />

      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="likes">Most liked</option>
        <option value="az">A-Z</option>
      </select>

      <div className="article-grid">
        {paginatedArticles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onLike={() => likeArticle(article.id)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination page={page} setPage={setPage} totalPages={totalPages} />
      )}
    </div>
  );
}
