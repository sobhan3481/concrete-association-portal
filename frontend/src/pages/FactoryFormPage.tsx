import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createFactory, FactoryPayload, getFactory, updateFactory } from '../api/client';
import { useAuth } from '../auth/AuthContext';

const defaultForm: FactoryPayload = {
  name: '',
  province: '',
  city: '',
  address: '',
  landOwnershipType: 'OWNED',
  hasWaterWell: false,
  hasLaboratory: false,
  hasWeighbridge: false,
  cementPurchaseSource: 'MIXED',
  operationalStatus: 'ACTIVE',
};

function toNumber(value: string): number | undefined {
  return value.trim() === '' ? undefined : Number(value);
}

function FactoryFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { token } = useAuth();
  const [form, setForm] = useState<FactoryPayload>(defaultForm);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    getFactory(id, token ?? undefined)
      .then((item) => setForm(item))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'دریافت کارخانه ناموفق بود'));
  }, [id, token]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');

    try {
      if (isEdit && id) {
        await updateFactory(id, form, token ?? undefined);
      } else {
        await createFactory(form, token ?? undefined);
      }
      navigate('/factories');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ذخیره کارخانه انجام نشد');
    }
  }

  return (
    <section className="card">
      <h2>{isEdit ? 'ویرایش کارخانه' : 'ثبت کارخانه جدید'}</h2>
      <form onSubmit={onSubmit}>
        <label>نام کارخانه</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <label>استان</label><input value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} required />
        <label>شهر</label><input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
        <label>آدرس</label><textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
        <label>متراژ زمین</label><input value={form.landAreaSqm ?? ''} onChange={(e) => setForm({ ...form, landAreaSqm: toNumber(e.target.value) })} />
        <label>نوع مالکیت زمین</label>
        <select value={form.landOwnershipType} onChange={(e) => setForm({ ...form, landOwnershipType: e.target.value as FactoryPayload['landOwnershipType'] })}>
          <option value="OWNED">ملکی</option><option value="RENTED">استیجاری</option><option value="PARTNERSHIP">مشارکتی</option><option value="OTHER">سایر</option>
        </select>
        <label>اجاره ماهانه</label><input value={form.monthlyRentAmount ?? ''} onChange={(e) => setForm({ ...form, monthlyRentAmount: toNumber(e.target.value) })} />
        <label>تعداد بچینگ</label><input value={form.batchingPlantCount ?? ''} onChange={(e) => setForm({ ...form, batchingPlantCount: toNumber(e.target.value) })} />
        <label>نوع بچینگ</label>
        <select value={form.batchingPlantType ?? ''} onChange={(e) => setForm({ ...form, batchingPlantType: (e.target.value || undefined) as FactoryPayload['batchingPlantType'] })}>
          <option value="">انتخاب نشده</option><option value="WET">مرطوب</option><option value="DRY">خشک</option><option value="HYBRID">هیبرید</option>
        </select>
        <label>برند بچینگ</label><input value={form.batchingPlantBrand ?? ''} onChange={(e) => setForm({ ...form, batchingPlantBrand: e.target.value })} />
        <label>ظرفیت تولید روزانه</label><input value={form.dailyProductionCapacityM3 ?? ''} onChange={(e) => setForm({ ...form, dailyProductionCapacityM3: toNumber(e.target.value) })} />
        <label>تعداد سیلو</label><input value={form.cementSiloCount ?? ''} onChange={(e) => setForm({ ...form, cementSiloCount: toNumber(e.target.value) })} />
        <label>ظرفیت سیلو</label><input value={form.cementSiloCapacityTons ?? ''} onChange={(e) => setForm({ ...form, cementSiloCapacityTons: toNumber(e.target.value) })} />

        <label className="checkbox-row"><input type="checkbox" checked={form.hasWaterWell} onChange={(e) => setForm({ ...form, hasWaterWell: e.target.checked })} /> چاه آب دارد؟</label>
        <label className="checkbox-row"><input type="checkbox" checked={form.hasLaboratory} onChange={(e) => setForm({ ...form, hasLaboratory: e.target.checked })} /> آزمایشگاه دارد؟</label>
        <label className="checkbox-row"><input type="checkbox" checked={form.hasWeighbridge} onChange={(e) => setForm({ ...form, hasWeighbridge: e.target.checked })} /> باسکول دارد؟</label>

        <label>نوع خرید سیمان</label>
        <select value={form.cementPurchaseSource} onChange={(e) => setForm({ ...form, cementPurchaseSource: e.target.value as FactoryPayload['cementPurchaseSource'] })}>
          <option value="COMMODITY_EXCHANGE">بورس کالا</option><option value="FREE_MARKET">بازار آزاد</option><option value="MIXED">ترکیبی</option>
        </select>

        <label>وضعیت فعالیت</label>
        <select value={form.operationalStatus} onChange={(e) => setForm({ ...form, operationalStatus: e.target.value as FactoryPayload['operationalStatus'] })}>
          <option value="ACTIVE">فعال</option><option value="SEMI_ACTIVE">نیمه‌فعال</option><option value="INACTIVE">غیرفعال</option>
        </select>

        <label>توضیحات</label><textarea value={form.notes ?? ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        <button type="submit">ذخیره کارخانه</button>
      </form>
      {error && <p className="error">{error}</p>}
    </section>
  );
}

export default FactoryFormPage;
