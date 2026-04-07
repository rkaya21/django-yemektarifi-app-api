# Django Tarif API

Kullanıcı, tarif ve etiket yönetimi için geliştirilmiş bir REST API projesi.

## Teknolojiler

- Django
- Django REST Framework
- PostgreSQL
- Docker Compose
- drf-spectacular

## Özellikler

- Kullanıcı oluşturma
- Token tabanlı kimlik doğrulama
- Giriş yapan kullanıcı bilgisini görüntüleme ve güncelleme
- Tarifler için CRUD işlemleri
- Etiketleri listeleme, güncelleme ve silme
- Swagger ve ReDoc API dokümantasyonu

## Proje Yapısı

- `app/`: Django uygulama kodu
- `requirements/`: çalışma, geliştirme ve production bağımlılıkları
- `docker-compose.yml`: yerel geliştirme ortamı
- `.env.example`: örnek ortam değişkenleri

## Hızlı Başlangıç

1. Örnek ortam dosyasını kopyalayın:

```bash
cp .env.example .env
```

2. Uygulamayı başlatın:

```bash
docker compose up --build
```

3. Aşağıdaki adresleri açın:

- Uygulama: `http://localhost:8000`
- Swagger UI: `http://localhost:8000/api/docs/`
- ReDoc: `http://localhost:8000/api/redoc/`
- OpenAPI şeması: `http://localhost:8000/api/schema/`

## Ortam Değişkenleri

Örnek değerler `.env.example` dosyasında yer alır:

```env
DEBUG=True
SECRET_KEY=change-this-in-production
ALLOWED_HOSTS=localhost,127.0.0.1
DB_HOST=db
DB_NAME=appdb
DB_USER=appuser
DB_PASS=change-me
DJANGO_SETTINGS_MODULE=app.settings
```

Notlar:

- Bu değerler geliştirme ortamı için örnektir.
- Production ortamında gerçek ve güçlü bir `SECRET_KEY` kullanın.
- Gerçek veritabanı kullanıcı adı, parola veya host bilgilerini repoya koymayın.

## Ana Endpoint'ler

### Kullanıcı

- `POST /api/user/create/`
- `POST /api/user/token/`
- `GET /api/user/me/`
- `PATCH /api/user/me/`

### Tarifler

- `GET /api/recipe/recipes/`
- `POST /api/recipe/recipes/`
- `GET /api/recipe/recipes/<id>/`
- `PATCH /api/recipe/recipes/<id>/`
- `PUT /api/recipe/recipes/<id>/`
- `DELETE /api/recipe/recipes/<id>/`

### Etiketler

- `GET /api/recipe/tags/`
- `PATCH /api/recipe/tags/<id>/`
- `DELETE /api/recipe/tags/<id>/`

## Geliştirme Komutları

Testleri çalıştırmak için:

```bash
docker compose run --rm app sh -c "python manage.py wait_for_db && python manage.py test"
```

Lint çalıştırmak için:

```bash
docker compose run --rm app sh -c "flake8"
```

## Ek Notlar

- Proje Docker tabanlı geliştirme akışına göre yapılandırılmıştır.
- Uygulama container'ı açılırken migration'lar otomatik çalışır.
- Korunan endpoint'lerde DRF token authentication kullanılır.
