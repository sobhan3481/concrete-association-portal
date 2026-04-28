import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { deleteMaterial, listFactories, listMaterials, MaterialItem } from '../api/client';
import { useAuth } from '../auth/AuthContext';

function MaterialsPage() {
  const { factoryId = '' } = useParams();
  const { token } = useAuth();
  const [items, setItems] = useState<MaterialItem[]>([]);
  const [factoryName, setFactoryName] = useState('');
  const [error, setError] = useState('');

  async function load() {
    try {
      const [factories, mats] = await Promise.all([listFactories(token ?? undefined), listMaterials(factoryId, token ?? undefined)]);
      const f = factories.find((x) => x.id === factoryId);
      setFactoryName(f?.name ?? '');
      setItems(mats);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'خطا در دریافت مواد اولیه');
    }
  }

  useEffect(() => { void load(); }, [factoryId, token]);

  async function onDelete(id: string) {
    await deleteMaterial(id, token ?? undefined);
    await load();
  }

  return <section className="card"><h2>مواد اولیه کارخانه</h2><p>مدیریت مواد اولیه و قیمت واحد برای کارخانه انتخاب‌شده</p>{factoryName && <p className="hint">کارخانه: {factoryName}</p>}<Link className="cta-primary" to={`/factories/${factoryId}/materials/new`}>ثبت ماده اولیه</Link>{error && <p className="error">{error}</p>}{items.length===0?<p className="hint">هنوز ماده اولیه‌ای برای این کارخانه ثبت نشده است.</p>:<div className="status-grid">{items.map(i=><article className="status-card" key={i.id}><h3>{i.name}</h3><p>نوع ماده: {i.materialType}</p><p>واحد: {i.unit}</p><p>قیمت واحد: {i.unitPrice}</p><p>منبع خرید: {i.purchaseSource ?? '-'}</p><p>وضعیت: {i.isActive?'فعال':'غیرفعال'}</p><div className="cta-row"><Link className="cta-secondary" to={`/materials/${i.id}/edit`}>ویرایش</Link><button onClick={()=>void onDelete(i.id)}>حذف</button></div></article>)}</div>}</section>;
}

export default MaterialsPage;
