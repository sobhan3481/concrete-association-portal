import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { deleteMixDesign, listMixDesigns, MixDesignItemModel } from '../api/client';
import { useAuth } from '../auth/AuthContext';

function MixDesignsPage() {
  const { factoryId = '' } = useParams();
  const { token } = useAuth();
  const [items, setItems] = useState<MixDesignItemModel[]>([]);

  async function load() { setItems(await listMixDesigns(factoryId, token ?? undefined)); }
  useEffect(()=>{ void load(); }, [factoryId, token]);

  return <section className="card"><h2>طرح‌های اختلاط بتن</h2><p>مدیریت طرح اختلاط و هزینه مستقیم مصالح برای هر مترمکعب</p><Link className="cta-primary" to={`/factories/${factoryId}/mix-designs/new`}>ثبت طرح اختلاط</Link>{items.length===0?<p className="hint">هنوز طرح اختلاطی ثبت نشده است.</p>:<div className="status-grid">{items.map(i=><article className="status-card" key={i.id}><h3>{i.title}</h3><p>عیار بتن: {i.concreteGrade}</p><p>رده مقاومتی: {i.resistanceClass ?? '-'}</p><p>اسلامپ: {i.slumpMm ?? '-'}</p><p>هزینه مستقیم مصالح: {i.directMaterialCostPerM3}</p><p>هزینه محاسبه‌شده: {i.calculatedCostPerM3}</p><p>وضعیت: {i.isActive?'فعال':'غیرفعال'}</p><div className="cta-row"><Link className="cta-secondary" to={`/mix-designs/${i.id}/edit`}>ویرایش</Link><Link className="cta-secondary" to={`/mix-designs/${i.id}/items`}>اجزای طرح</Link><button onClick={async()=>{await deleteMixDesign(i.id, token??undefined); await load();}}>حذف</button></div></article>)}</div>}</section>;
}

export default MixDesignsPage;
