export default function ArticleCard({ article, onLike }) {
  return (
    <div style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
      <h3>{article.title}</h3>
      <p>{article.content}</p>
      <button onClick={() => onLike(article.id)}>
        👍 {article.likes}
      </button>
    </div>
  );
}
