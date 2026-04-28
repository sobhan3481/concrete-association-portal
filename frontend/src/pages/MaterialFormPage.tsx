import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createMaterial, getMaterial, MaterialPayload, updateMaterial } from '../api/client';
import { useAuth } from '../auth/AuthContext';

const def: MaterialPayload = { materialType: 'CEMENT', name: '', unit: 'KG', unitPrice: 0, isActive: true };

function MaterialFormPage() {
  const { factoryId, id } = useParams();
  const { token } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState<MaterialPayload>(def);
  const [targetFactory, setTargetFactory] = useState(factoryId ?? '');

  useEffect(() => { if (id) getMaterial(id, token ?? undefined).then((m)=>{ setForm(m); setTargetFactory(m.factoryId); }); }, [id, token]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (id) await updateMaterial(id, form, token ?? undefined); else await createMaterial(targetFactory, form, token ?? undefined);
    nav(`/factories/${targetFactory}/materials`);
  }

  return <section className="card"><h2>{id?'ویرایش ماده اولیه':'ثبت ماده اولیه'}</h2><form onSubmit={submit}><label>نوع ماده</label><select value={form.materialType} onChange={(e)=>setForm({...form,materialType:e.target.value as MaterialPayload['materialType']})}><option value="CEMENT">سیمان</option><option value="COARSE_AGGREGATE">شن</option><option value="FINE_AGGREGATE">ماسه</option><option value="WATER">آب</option><option value="ADMIXTURE">افزودنی</option><option value="GEL">ژل</option><option value="POZZOLAN">پوزولان</option><option value="SLAG">سرباره</option><option value="OTHER">سایر</option></select><label>نام ماده</label><input value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required/><label>واحد</label><select value={form.unit} onChange={(e)=>setForm({...form,unit:e.target.value as MaterialPayload['unit']})}><option value="KG">کیلوگرم</option><option value="TON">تن</option><option value="LITER">لیتر</option><option value="CUBIC_METER">مترمکعب</option><option value="UNIT">عدد</option></select><label>قیمت واحد</label><input value={form.unitPrice} onChange={(e)=>setForm({...form,unitPrice:Number(e.target.value)})}/><label>تامین‌کننده</label><input value={form.supplierName??''} onChange={(e)=>setForm({...form,supplierName:e.target.value})}/><label>منبع خرید</label><select value={form.purchaseSource??''} onChange={(e)=>setForm({...form,purchaseSource:(e.target.value||undefined) as MaterialPayload['purchaseSource']})}><option value="">انتخاب نشده</option><option value="COMMODITY_EXCHANGE">بورس کالا</option><option value="FREE_MARKET">بازار آزاد</option><option value="DIRECT_SUPPLIER">تامین‌کننده مستقیم</option><option value="INTERNAL">داخلی</option><option value="OTHER">سایر</option></select><label className="checkbox-row"><input type="checkbox" checked={form.isActive} onChange={(e)=>setForm({...form,isActive:e.target.checked})}/> فعال است؟</label><label>توضیحات</label><textarea value={form.notes??''} onChange={(e)=>setForm({...form,notes:e.target.value})}/><button type="submit">ذخیره ماده اولیه</button></form></section>;
}

export default MaterialFormPage;
