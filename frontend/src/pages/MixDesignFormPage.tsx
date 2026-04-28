import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createMixDesign, getMixDesign, MixDesignPayload, updateMixDesign } from '../api/client';
import { useAuth } from '../auth/AuthContext';

const def: MixDesignPayload = { title: '', concreteGrade: 300, isActive: true, wasteFactorPercent: 0, labCostPerM3: 0 };

function MixDesignFormPage() {
  const { factoryId, id } = useParams();
  const { token } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState<MixDesignPayload>(def);
  const [targetFactory, setTargetFactory] = useState(factoryId ?? '');

  useEffect(() => { if (id) getMixDesign(id, token ?? undefined).then((m)=>{ setForm(m); setTargetFactory(m.factoryId); }); }, [id, token]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (id) await updateMixDesign(id, form, token ?? undefined); else await createMixDesign(targetFactory, form, token ?? undefined);
    nav(`/factories/${targetFactory}/mix-designs`);
  }

  return <section className="card"><h2>{id?'ویرایش طرح اختلاط':'ثبت طرح اختلاط'}</h2><form onSubmit={submit}><label>عنوان طرح</label><input value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} required/><label>عیار بتن</label><input value={form.concreteGrade} onChange={(e)=>setForm({...form,concreteGrade:Number(e.target.value)})}/><label>رده مقاومتی</label><input value={form.resistanceClass??''} onChange={(e)=>setForm({...form,resistanceClass:e.target.value})}/><label>اسلامپ</label><input value={form.slumpMm??''} onChange={(e)=>setForm({...form,slumpMm:e.target.value===''?undefined:Number(e.target.value)})}/><label>مقاومت هدف</label><input value={form.targetStrengthMpa??''} onChange={(e)=>setForm({...form,targetStrengthMpa:e.target.value===''?undefined:Number(e.target.value)})}/><label>درصد پرت</label><input value={form.wasteFactorPercent??0} onChange={(e)=>setForm({...form,wasteFactorPercent:Number(e.target.value)})}/><label>هزینه آزمایشگاه برای هر مترمکعب</label><input value={form.labCostPerM3??0} onChange={(e)=>setForm({...form,labCostPerM3:Number(e.target.value)})}/><label className="checkbox-row"><input type="checkbox" checked={form.isActive} onChange={(e)=>setForm({...form,isActive:e.target.checked})}/> فعال است؟</label><label>توضیحات</label><textarea value={form.notes??''} onChange={(e)=>setForm({...form,notes:e.target.value})}/><button type="submit">ذخیره طرح اختلاط</button></form></section>;
}

export default MixDesignFormPage;
