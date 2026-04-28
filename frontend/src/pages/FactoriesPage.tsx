import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteFactory, FactoryItem, listFactories } from '../api/client';
import { useAuth } from '../auth/AuthContext';

function FactoriesPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<FactoryItem[]>([]);
  const [error, setError] = useState('');

  async function load() {
    try {
      const data = await listFactories(token ?? undefined);
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در دریافت اطلاعات کارخانه‌ها');
    }
  }

  useEffect(() => {
    void load();
  }, [token]);

  async function onDelete(id: string) {
    if (!confirm('آیا از حذف کارخانه مطمئن هستید؟')) return;
    try {
      await deleteFactory(id, token ?? undefined);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حذف کارخانه انجام نشد');
    }
  }

  return (
    <section className="card">
      <h2>کارخانه‌ها</h2>
      <p>مدیریت کارخانه‌های ثبت‌شده برای شرکت شما</p>
      <Link className="cta-primary" to="/factories/new">ثبت کارخانه جدید</Link>
      {error && <p className="error">{error}</p>}

      {items.length === 0 ? (
        <p className="hint">هنوز کارخانه‌ای ثبت نشده است.</p>
      ) : (
        <div className="status-grid">
          {items.map((item) => (
            <article className="status-card" key={item.id}>
              <h3>{item.name}</h3>
              <p>{item.city} / {item.province}</p>
              <p>نوع بچینگ: {item.batchingPlantType ?? 'ثبت نشده'}</p>
              <p>ظرفیت تولید: {item.dailyProductionCapacityM3 ?? '-'} مترمکعب</p>
              <p>وضعیت فعالیت: {item.operationalStatus}</p>
              <div className="cta-row">
                <Link className="cta-secondary" to={`/factories/${item.id}/machinery`}>ماشین‌آلات</Link>
                <Link className="cta-secondary" to={`/factories/${item.id}/materials`}>مواد اولیه</Link>
                <Link className="cta-secondary" to={`/factories/${item.id}/mix-designs`}>طرح اختلاط</Link>
                <Link className="cta-secondary" to={`/factories/${item.id}/edit`}>ویرایش</Link>
                <button type="button" onClick={() => onDelete(item.id)}>حذف</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default FactoriesPage;
