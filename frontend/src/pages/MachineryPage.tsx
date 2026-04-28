import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { deleteMachinery, FactoryItem, listFactories, listMachinery, MachineryItem } from '../api/client';
import { useAuth } from '../auth/AuthContext';

function MachineryPage() {
  const { factoryId = '' } = useParams();
  const { token } = useAuth();
  const [factoryName, setFactoryName] = useState('');
  const [items, setItems] = useState<MachineryItem[]>([]);
  const [error, setError] = useState('');

  async function load() {
    try {
      const [factories, machinery] = await Promise.all([listFactories(token ?? undefined), listMachinery(factoryId, token ?? undefined)]);
      const factory = (factories as FactoryItem[]).find((x) => x.id === factoryId);
      setFactoryName(factory?.name ?? '');
      setItems(machinery);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در دریافت ماشین‌آلات');
    }
  }

  useEffect(() => {
    void load();
  }, [factoryId, token]);

  async function onDelete(id: string) {
    if (!confirm('آیا از حذف ماشین‌آلات مطمئن هستید؟')) return;
    try {
      await deleteMachinery(id, token ?? undefined);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حذف انجام نشد');
    }
  }

  return (
    <section className="card">
      <h2>ماشین‌آلات کارخانه</h2>
      <p>مدیریت ماشین‌آلات ثبت‌شده برای کارخانه انتخاب‌شده</p>
      {factoryName && <p className="hint">کارخانه: {factoryName}</p>}
      <Link className="cta-primary" to={`/factories/${factoryId}/machinery/new`}>ثبت ماشین‌آلات جدید</Link>
      {error && <p className="error">{error}</p>}

      {items.length === 0 ? (
        <p className="hint">هنوز ماشین‌آلاتی برای این کارخانه ثبت نشده است.</p>
      ) : (
        <div className="status-grid">
          {items.map((item) => (
            <article className="status-card" key={item.id}>
              <h3>{item.title}</h3>
              <p>نوع ماشین‌آلات: {item.machineryType}</p>
              <p>مالکیت: {item.ownershipType}</p>
              <p>تعداد: {item.quantity}</p>
              <p>ظرفیت: {item.capacityValue ?? '-'} {item.capacityUnit ?? ''}</p>
              <p>وضعیت: {item.isActive ? 'فعال' : 'غیرفعال'}</p>
              <div className="cta-row">
                <Link className="cta-secondary" to={`/machinery/${item.id}/edit`}>ویرایش</Link>
                <button type="button" onClick={() => onDelete(item.id)}>حذف</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default MachineryPage;
