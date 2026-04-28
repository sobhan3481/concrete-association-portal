import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createMachinery, getMachinery, MachineryPayload, updateMachinery } from '../api/client';
import { useAuth } from '../auth/AuthContext';

const defaultForm: MachineryPayload = {
  machineryType: 'LOADER',
  ownershipType: 'OWNED',
  title: '',
  quantity: 1,
  isActive: true,
};

function toNumber(value: string): number | undefined {
  return value.trim() === '' ? undefined : Number(value);
}

function MachineryFormPage() {
  const { factoryId, id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { token } = useAuth();
  const [form, setForm] = useState<MachineryPayload>(defaultForm);
  const [targetFactoryId, setTargetFactoryId] = useState(factoryId ?? '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    getMachinery(id, token ?? undefined)
      .then((item: MachineryPayload & { factoryId: string }) => {
        setForm(item);
        setTargetFactoryId(item.factoryId);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'خطا در دریافت اطلاعات'));
  }, [id, token]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');

    try {
      if (isEdit && id) {
        await updateMachinery(id, form, token ?? undefined);
      } else {
        await createMachinery(targetFactoryId, form, token ?? undefined);
      }
      navigate(`/factories/${targetFactoryId}/machinery`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ذخیره اطلاعات انجام نشد');
    }
  }

  return (
    <section className="card">
      <h2>{isEdit ? 'ویرایش ماشین‌آلات' : 'ثبت ماشین‌آلات جدید'}</h2>
      <form onSubmit={onSubmit}>
        <label>نوع ماشین‌آلات</label>
        <select value={form.machineryType} onChange={(e) => setForm({ ...form, machineryType: e.target.value as MachineryPayload['machineryType'] })}>
          <option value="LOADER">لودر</option><option value="MIXER">میکسر</option><option value="DUMP_TRUCK">کمپرسی</option><option value="STATIONARY_PUMP">پمپ ثابت</option><option value="BOOM_PUMP">پمپ دکل</option>
        </select>
        <label>نوع مالکیت</label>
        <select value={form.ownershipType} onChange={(e) => setForm({ ...form, ownershipType: e.target.value as MachineryPayload['ownershipType'] })}>
          <option value="OWNED">ملکی</option><option value="RENTED">استیجاری</option><option value="LEASED">لیزینگی</option><option value="OTHER">سایر</option>
        </select>
        <label>عنوان</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <label>تعداد</label><input value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} required />
        <label>برند</label><input value={form.brand ?? ''} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
        <label>مدل</label><input value={form.model ?? ''} onChange={(e) => setForm({ ...form, model: e.target.value })} />
        <label>سال ساخت</label><input value={form.manufactureYear ?? ''} onChange={(e) => setForm({ ...form, manufactureYear: toNumber(e.target.value) })} />
        <label>ظرفیت</label><input value={form.capacityValue ?? ''} onChange={(e) => setForm({ ...form, capacityValue: toNumber(e.target.value) })} />
        <label>واحد ظرفیت</label><input value={form.capacityUnit ?? ''} onChange={(e) => setForm({ ...form, capacityUnit: e.target.value })} />
        <label>طول دکل (فقط پمپ دکل)</label><input value={form.boomLengthMeters ?? ''} onChange={(e) => setForm({ ...form, boomLengthMeters: toNumber(e.target.value) })} />
        <label>اجاره ماهانه</label><input value={form.monthlyRentAmount ?? ''} onChange={(e) => setForm({ ...form, monthlyRentAmount: toNumber(e.target.value) })} />
        <label>استهلاک ماهانه</label><input value={form.depreciationMonthlyAmount ?? ''} onChange={(e) => setForm({ ...form, depreciationMonthlyAmount: toNumber(e.target.value) })} />
        <label>هزینه سوخت ماهانه</label><input value={form.fuelCostMonthly ?? ''} onChange={(e) => setForm({ ...form, fuelCostMonthly: toNumber(e.target.value) })} />
        <label>هزینه تعمیرات ماهانه</label><input value={form.maintenanceCostMonthly ?? ''} onChange={(e) => setForm({ ...form, maintenanceCostMonthly: toNumber(e.target.value) })} />
        <label>هزینه راننده/اپراتور ماهانه</label><input value={form.driverOrOperatorCostMonthly ?? ''} onChange={(e) => setForm({ ...form, driverOrOperatorCostMonthly: toNumber(e.target.value) })} />
        <label className="checkbox-row"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> فعال است؟</label>
        <label>توضیحات</label><textarea value={form.notes ?? ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        <button type="submit">ذخیره ماشین‌آلات</button>
      </form>
      {error && <p className="error">{error}</p>}
    </section>
  );
}

export default MachineryFormPage;
