import { Link, useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import blogPosts from '../data/blogPosts';

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const idx = Number(id);
  const post = blogPosts[idx];

  if (!post) {
    return (
      <main className="max-w-4xl mx-auto py-20 px-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Article not found</h2>
          <p className="text-sm text-dark-muted mb-6">We couldn't find that article.</p>
          <button onClick={() => navigate(-1)} className="pill-btn">
            Go back
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto py-12 px-6">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center gap-2 text-dark-muted hover:text-accent">
          <FiArrowLeft /> Back
        </Link>
      </div>

      <article className="prose prose-lg">
        <div className="mb-4">
          <span className="inline-block text-xs uppercase tracking-widest bg-accent text-white px-2 py-1 rounded">{post.tag}</span>
        </div>
        <h1 className="text-3xl font-bold mb-3">{post.title}</h1>
        <p className="text-sm text-dark-muted mb-6">{post.read}</p>
        <img src={post.image} alt={post.title} className="w-full h-64 object-cover rounded-lg mb-6" />
        <p className="text-base leading-relaxed">{post.body}</p>
      </article>
    </main>
  );
}
