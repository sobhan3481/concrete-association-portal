import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMixDesign, listMaterials, MixDesignItemPayload, MixDesignItemModel, updateMixDesignItems } from '../api/client';
import { useAuth } from '../auth/AuthContext';

type Row = MixDesignItemPayload;

function MixDesignItemsPage() {
  const { id = '' } = useParams();
  const { token } = useAuth();
  const [design, setDesign] = useState<MixDesignItemModel | null>(null);
  const [materials, setMaterials] = useState<{id:string;name:string;unit:string}[]>([]);
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    getMixDesign(id, token ?? undefined).then((d) => {
      setDesign(d);
      setRows((d.items ?? []).map((x) => ({ materialId: x.materialId, quantity: x.quantity, unit: x.unit })));
      return listMaterials(d.factoryId, token ?? undefined);
    }).then((m)=>setMaterials(m));
  }, [id, token]);

  function addRow() { if (materials.length===0) return; setRows([...rows, { materialId: materials[0].id, quantity: 1, unit: materials[0].unit as Row['unit'] }]); }

  async function submit(e: FormEvent) {
    e.preventDefault();
    const updated = await updateMixDesignItems(id, rows, token ?? undefined);
    setDesign(updated);
  }

  return <section className="card"><h2>اجزای طرح اختلاط</h2>{design && <p className="hint">{design.title} - عیار {design.concreteGrade}</p>}<form onSubmit={submit}><button type="button" onClick={addRow}>افزودن ردیف</button>{rows.map((r,idx)=><div key={idx} className="status-box"><label>ماده اولیه</label><select value={r.materialId} onChange={(e)=>{const next=[...rows]; next[idx].materialId=e.target.value; setRows(next);}}>{materials.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select><label>مقدار</label><input value={r.quantity} onChange={(e)=>{const next=[...rows]; next[idx].quantity=Number(e.target.value); setRows(next);}}/><label>واحد</label><select value={r.unit} onChange={(e)=>{const next=[...rows]; next[idx].unit=e.target.value as Row['unit']; setRows(next);}}><option value="KG">کیلوگرم</option><option value="TON">تن</option><option value="LITER">لیتر</option><option value="CUBIC_METER">مترمکعب</option><option value="UNIT">عدد</option></select></div>)}<button type="submit">ذخیره اجزای طرح</button></form>{design && <div className="status-grid"><article className="status-card"><h3>جمع هزینه مستقیم مصالح</h3><p>{design.directMaterialCostPerM3}</p></article><article className="status-card"><h3>هزینه آزمایشگاه</h3><p>{design.labCostPerM3 ?? 0}</p></article><article className="status-card"><h3>درصد پرت</h3><p>{design.wasteFactorPercent ?? 0}</p></article><article className="status-card"><h3>هزینه محاسبه‌شده هر مترمکعب</h3><p>{design.calculatedCostPerM3}</p></article></div>}</section>;
}

export default MixDesignItemsPage;
