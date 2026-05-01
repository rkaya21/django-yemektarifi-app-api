import heroImg from './assets/hero.png'
import './App.css'

const endpoints = [
  {
    method: 'POST',
    path: '/api/user/create/',
    description: 'Yeni kullanıcı kaydı ve şifre doğrulaması.',
  },
  {
    method: 'POST',
    path: '/api/user/token/',
    description: 'Token üretimi ve oturum açma akışı.',
  },
  {
    method: 'GET',
    path: '/api/recipe/recipes/',
    description: 'Kullanıcının tariflerini listeleme ve filtreleme.',
  },
  {
    method: 'PATCH',
    path: '/api/recipe/tags/<id>/',
    description: 'Etiket güncelleme ve silme işlemleri.',
  },
]

const features = [
  {
    eyebrow: 'Kimlik',
    title: 'Token bazlı giriş',
    text: 'DRF token authentication ile güvenli kullanıcı akışı ve profile erişimi.',
  },
  {
    eyebrow: 'İçerik',
    title: 'Tarif yönetimi',
    text: 'CRUD operasyonları, kullanıcı bazlı görünürlük ve etiket ilişkileri.',
  },
  {
    eyebrow: 'Dokümantasyon',
    title: 'Swagger + ReDoc',
    text: 'API şeması, interaktif dokümantasyon ve hızlı test için hazır uçlar.',
  },
]

const flow = [
  'Kullanıcı oluştur',
  'Token al',
  'Tarif ekle',
  'Etiketlerle düzenle',
]

function App() {
  return (
    <main className="shell">
      <section className="hero">
        <div className="hero__copy">
          <span className="eyebrow">Django Tarif API</span>
          <h1>Tarif, etiket ve kullanıcı akışını tek API’de topla.</h1>
          <p className="lede">
            Yemek tarifi uygulaması için hazırlanmış REST API. Kullanıcı
            oluşturma, token ile giriş, tarif CRUD ve etiket yönetimi tek bir
            tutarlı yapı altında çalışır.
          </p>

          <div className="hero__actions">
            <a
              className="button button--primary"
              href="/api/docs/"
              target="_blank"
              rel="noreferrer"
            >
              Swagger UI
            </a>
            <a
              className="button button--ghost"
              href="/api/schema/"
              target="_blank"
              rel="noreferrer"
            >
              OpenAPI Schema
            </a>
          </div>

          <dl className="stats" aria-label="Proje özellikleri">
            <div>
              <dt>3</dt>
              <dd>ana kullanıcı endpoint’i</dd>
            </div>
            <div>
              <dt>2</dt>
              <dd>dokümantasyon arayüzü</dd>
            </div>
            <div>
              <dt>100%</dt>
              <dd>kullanıcı bazlı veri ayrımı</dd>
            </div>
          </dl>
        </div>

        <div className="hero__visual">
          <div className="card card--image">
            <img src={heroImg} alt="Katmanlı yemek tariflerini temsil eden illüstrasyon" />
          </div>

          <div className="card card--code">
            <div className="card__header">
              <span>Örnek akış</span>
              <span className="chip">JSON</span>
            </div>
            <pre>{`POST /api/user/token/
{
  "email": "user@example.com",
  "password": "********"
}

GET /api/recipe/recipes/
Authorization: Token <token>`}</pre>
          </div>
        </div>
      </section>

      <section className="section section--features" aria-labelledby="features-title">
        <div className="section__heading">
          <span className="eyebrow">Öne çıkanlar</span>
          <h2 id="features-title">Faz 1 için tamamlanan temel yapı</h2>
        </div>

        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature" key={feature.title}>
              <span className="feature__eyebrow">{feature.eyebrow}</span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--endpoints" aria-labelledby="endpoints-title">
        <div className="section__heading">
          <span className="eyebrow">Uç noktalar</span>
          <h2 id="endpoints-title">Kullanıcı, tarif ve etiket akışları</h2>
        </div>

        <div className="endpoint-layout">
          <div className="endpoint-list">
            {endpoints.map((endpoint) => (
              <article className="endpoint" key={endpoint.path}>
                <span className={`method method--${endpoint.method.toLowerCase()}`}>
                  {endpoint.method}
                </span>
                <div>
                  <h3>{endpoint.path}</h3>
                  <p>{endpoint.description}</p>
                </div>
              </article>
            ))}
          </div>

          <aside className="workflow">
            <span className="eyebrow">Kullanım akışı</span>
            <ol>
              {flow.map((step, index) => (
                <li key={step}>
                  <span>{index + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
            <p className="workflow__note">
              Swagger UI üzerinden deneyebilir, ReDoc ile daha okunaklı şema
              görünümü alabilirsin.
            </p>
          </aside>
        </div>
      </section>
    </main>
  )
}

export default App
