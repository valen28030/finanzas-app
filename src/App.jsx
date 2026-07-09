import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Briefcase,
  CalendarDays,
  Car,
  CheckCircle2,
  CreditCard,
  Download,
  HandCoins,
  Home,
  Landmark,
  PiggyBank,
  Plus,
  ReceiptText,
  RefreshCw,
  Repeat2,
  Search,
  Settings,
  Target,
  Trash2,
  Upload,
  Wallet,
} from "lucide-react";

const STORAGE_KEY = "finanzas-personales-v1";
const today = new Date();
const todayInput = toInputDate(today);

const accountColors = {
  bbva: "#0f67d7",
  openbank: "#38bdf8",
  cash: "#0f172a",
};

const categoryOptions = {
  income: ["Nómina", "Negocio", "Devolución", "Venta", "Otros ingresos"],
  expense: [
    "Compra",
    "Gimnasio",
    "Coche",
    "Impuestos",
    "Suscripción",
    "Salud",
    "Ocio",
    "Imprevisto",
    "Inversión",
    "Otros gastos",
  ],
  transfer: ["Ahorro", "Inversión", "Efectivo", "Movimiento entre cuentas"],
};

const carCategories = [
  "Gasolina",
  "Limpieza",
  "Revision",
  "ITV",
  "Seguro",
  "Reparacion",
  "Peajes",
  "Neumaticos",
  "Otros",
];

const fixedCategories = [
  "Gimnasio",
  "Seguro coche",
  "Impuestos",
  "Renta",
  "Spotify for Artists",
  "Suscripción",
  "Negocio",
  "Otros",
];

const frequencyLabels = {
  monthly: "Mensual",
  quarterly: "Trimestral",
  yearly: "Anual",
  custom: "Puntual",
};

const tabs = [
  { id: "dashboard", label: "Resumen", shortLabel: "Ini", icon: Home },
  { id: "movements", label: "Movs.", shortLabel: "Mov", icon: CreditCard },
  { id: "fixed", label: "Fijos", shortLabel: "Fij", icon: CalendarDays },
  { id: "car", label: "Coche", shortLabel: "Auto", icon: Car },
  { id: "payroll", label: "Nómina", shortLabel: "Nom", icon: PiggyBank },
  { id: "business", label: "Negocio", shortLabel: "Neg", icon: Briefcase },
  { id: "debts", label: "Deudas", shortLabel: "Deu", icon: HandCoins },
  { id: "settings", label: "Ajustes", shortLabel: "Aj", icon: Settings },
];

const defaultFinance = {
  accounts: [
    {
      id: "bbva",
      name: "BBVA",
      role: "Nómina, tarjeta y día a día",
      balance: 1840.35,
    },
    {
      id: "openbank",
      name: "Openbank",
      role: "Ahorro separado",
      balance: 5200,
    },
    {
      id: "cash",
      name: "Efectivo",
      role: "Dinero en mano",
      balance: 180,
    },
  ],
  salaryPlan: {
    salary: 2300,
    payday: 30,
    savings: 500,
    investment: 250,
    accountId: "bbva",
    savingsAccountId: "openbank",
  },
  movements: [
    {
      id: createId(),
      type: "income",
      date: moveDate(-8),
      accountId: "bbva",
      toAccountId: "",
      category: "Nómina",
      amount: 2300,
      notes: "Nómina mensual",
    },
    {
      id: createId(),
      type: "transfer",
      date: moveDate(-7),
      accountId: "bbva",
      toAccountId: "openbank",
      category: "Ahorro",
      amount: 550,
      notes: "Ahorro automático del mes",
    },
    {
      id: createId(),
      type: "expense",
      date: moveDate(-3),
      accountId: "bbva",
      toAccountId: "",
      category: "Compra",
      amount: 72.4,
      notes: "Supermercado",
    },
  ],
  fixedExpenses: [
    {
      id: createId(),
      name: "Gimnasio",
      amount: 135,
      frequency: "quarterly",
      nextDate: nextDateForDay(8, 3),
      accountId: "bbva",
      category: "Gimnasio",
      notes: "Pago trimestral el día 8",
    },
    {
      id: createId(),
      name: "Seguro del coche",
      amount: 420,
      frequency: "yearly",
      nextDate: nextMonthDate(15),
      accountId: "bbva",
      category: "Seguro coche",
      notes: "Renovación anual",
    },
    {
      id: createId(),
      name: "Spotify for Artists",
      amount: 11.99,
      frequency: "monthly",
      nextDate: nextDateForDay(22, 1),
      accountId: "bbva",
      category: "Spotify for Artists",
      notes: "",
    },
    {
      id: createId(),
      name: "Declaracion de la renta",
      amount: 0,
      frequency: "yearly",
      nextDate: `${today.getFullYear() + 1}-06-30`,
      accountId: "bbva",
      category: "Renta",
      notes: "Reserva cuando toque",
    },
  ],
  carExpenses: [
    {
      id: createId(),
      date: moveDate(-12),
      category: "Gasolina",
      amount: 58,
      accountId: "bbva",
      notes: "Deposito completo",
    },
    {
      id: createId(),
      date: moveDate(-31),
      category: "Limpieza",
      amount: 12,
      accountId: "bbva",
      notes: "Lavado exterior",
    },
  ],
  businessEntries: [
    {
      id: createId(),
      date: moveDate(-10),
      kind: "income",
      concept: "Venta / servicio",
      amount: 120,
      accountId: "bbva",
      notes: "Ingreso pequeño del negocio",
    },
    {
      id: createId(),
      date: moveDate(-42),
      kind: "expense",
      concept: "Herramienta del negocio",
      amount: 39,
      accountId: "bbva",
      notes: "Gasto cada ciertos meses",
    },
  ],
  payrollEntries: [],
  debts: [
    {
      id: createId(),
      direction: "favor",
      person: "Pendiente de cobrar",
      amount: 90,
      dueDate: nextMonthDate(5),
      status: "open",
      notes: "Deuda a favor",
    },
    {
      id: createId(),
      direction: "contra",
      person: "Pendiente de pagar",
      amount: 45,
      dueDate: nextDateForDay(18, 1),
      status: "open",
      notes: "Deuda en contra",
    },
  ],
};

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [finance, setFinance] = useState(loadFinance);
  const [movementForm, setMovementForm] = useState(createMovementForm());
  const [fixedForm, setFixedForm] = useState(createFixedForm());
  const [carForm, setCarForm] = useState(createCarForm());
  const [businessForm, setBusinessForm] = useState(createBusinessForm());
  const [debtForm, setDebtForm] = useState(createDebtForm());
  const [payrollForm, setPayrollForm] = useState(() => createPayrollForm(finance.salaryPlan));

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(finance));
  }, [finance]);

  const accountMap = useMemo(
    () => Object.fromEntries(finance.accounts.map((account) => [account.id, account])),
    [finance.accounts],
  );

  const ledger = useMemo(() => buildLedger(finance), [finance]);
  const currentMonthLedger = useMemo(
    () => ledger.filter((item) => isSameMonth(item.date, today)),
    [ledger],
  );

  const totals = useMemo(() => {
    const monthIncome = sumByType(currentMonthLedger, "income");
    const monthExpense = sumByType(currentMonthLedger, "expense");
    const totalBalance = finance.accounts.reduce((total, account) => total + account.balance, 0);
    const fixedMonthly = finance.fixedExpenses.reduce(
      (total, expense) => total + monthlyEquivalent(expense),
      0,
    );
    const debtsFavor = finance.debts
      .filter((debt) => debt.direction === "favor" && debt.status === "open")
      .reduce((total, debt) => total + debt.amount, 0);
    const debtsContra = finance.debts
      .filter((debt) => debt.direction === "contra" && debt.status === "open")
      .reduce((total, debt) => total + debt.amount, 0);

    return {
      totalBalance,
      monthIncome,
      monthExpense,
      monthNet: monthIncome - monthExpense,
      fixedMonthly,
      debtsFavor,
      debtsContra,
    };
  }, [currentMonthLedger, finance.accounts, finance.debts, finance.fixedExpenses]);

  const nextFixed = useMemo(
    () =>
      [...finance.fixedExpenses]
        .sort((first, second) => parseDate(first.nextDate) - parseDate(second.nextDate))
        .slice(0, 4),
    [finance.fixedExpenses],
  );

  const allocationData = useMemo(() => {
    const fixed = roundCurrency(totals.fixedMonthly);
    const flexible = Math.max(
      finance.salaryPlan.salary - finance.salaryPlan.savings - finance.salaryPlan.investment - fixed,
      0,
    );

    return [
      { name: "Ahorro", value: finance.salaryPlan.savings, color: "#0f67d7" },
      { name: "Inversión", value: finance.salaryPlan.investment, color: "#38bdf8" },
      { name: "Fijos", value: fixed, color: "#1e3a8a" },
      { name: "Libre", value: roundCurrency(flexible), color: "#93c5fd" },
    ].filter((item) => item.value > 0);
  }, [finance.salaryPlan, totals.fixedMonthly]);

  const monthlyFlowData = useMemo(
    () => [
      { name: "Ingresos", value: totals.monthIncome },
      { name: "Gastos", value: totals.monthExpense },
      { name: "Neto", value: totals.monthNet },
    ],
    [totals],
  );

  function submitMovement(event) {
    event.preventDefault();
    const amount = parseAmount(movementForm.amount);
    if (!amount) return;
    const targetAccountId =
      movementForm.type === "transfer" && movementForm.toAccountId !== movementForm.accountId
        ? movementForm.toAccountId
        : finance.accounts.find((account) => account.id !== movementForm.accountId)?.id ?? "";

    const movement = {
      id: createId(),
      type: movementForm.type,
      date: movementForm.date,
      accountId: movementForm.accountId,
      toAccountId: movementForm.type === "transfer" ? targetAccountId : "",
      category: movementForm.category,
      amount,
      notes: movementForm.notes.trim(),
    };

    setFinance((current) => ({
      ...current,
      accounts: applyMovementToAccounts(current.accounts, movement, 1),
      movements: [movement, ...current.movements],
    }));
    setMovementForm(createMovementForm({ type: movementForm.type }));
  }

  function removeMovement(movementId) {
    setFinance((current) => {
      const movement = current.movements.find((item) => item.id === movementId);
      if (!movement) return current;

      return {
        ...current,
        accounts: applyMovementToAccounts(current.accounts, movement, -1),
        movements: current.movements.filter((item) => item.id !== movementId),
      };
    });
  }

  function submitFixed(event) {
    event.preventDefault();
    const amount = parseAmount(fixedForm.amount);
    if (!fixedForm.name.trim()) return;

    const fixedExpense = {
      id: createId(),
      name: fixedForm.name.trim(),
      amount,
      frequency: fixedForm.frequency,
      nextDate: fixedForm.nextDate,
      accountId: fixedForm.accountId,
      category: fixedForm.category,
      notes: fixedForm.notes.trim(),
    };

    setFinance((current) => ({
      ...current,
      fixedExpenses: [fixedExpense, ...current.fixedExpenses],
    }));
    setFixedForm(createFixedForm());
  }

  function markFixedPaid(expenseId) {
    setFinance((current) => {
      const expense = current.fixedExpenses.find((item) => item.id === expenseId);
      if (!expense || !expense.amount) return current;

      const movement = {
        id: createId(),
        type: "expense",
        date: todayInput,
        accountId: expense.accountId,
        toAccountId: "",
        category: expense.category,
        amount: expense.amount,
        notes: `Pago fijo: ${expense.name}`,
      };

      return {
        ...current,
        accounts: applyMovementToAccounts(current.accounts, movement, 1),
        movements: [movement, ...current.movements],
        fixedExpenses: current.fixedExpenses.map((item) =>
          item.id === expenseId ? { ...item, nextDate: advanceDate(item.nextDate, item.frequency) } : item,
        ),
      };
    });
  }

  function removeFixed(expenseId) {
    setFinance((current) => ({
      ...current,
      fixedExpenses: current.fixedExpenses.filter((item) => item.id !== expenseId),
    }));
  }

  function submitCarExpense(event) {
    event.preventDefault();
    const amount = parseAmount(carForm.amount);
    if (!amount) return;

    const carExpense = {
      id: createId(),
      date: carForm.date,
      category: carForm.category,
      amount,
      accountId: carForm.accountId,
      notes: carForm.notes.trim(),
    };

    setFinance((current) => ({
      ...current,
      accounts: current.accounts.map((account) =>
        account.id === carExpense.accountId
          ? { ...account, balance: roundCurrency(account.balance - amount) }
          : account,
      ),
      carExpenses: [carExpense, ...current.carExpenses],
    }));
    setCarForm(createCarForm());
  }

  function removeCarExpense(expenseId) {
    setFinance((current) => {
      const expense = current.carExpenses.find((item) => item.id === expenseId);
      if (!expense) return current;

      return {
        ...current,
        accounts: current.accounts.map((account) =>
          account.id === expense.accountId
            ? { ...account, balance: roundCurrency(account.balance + expense.amount) }
            : account,
        ),
        carExpenses: current.carExpenses.filter((item) => item.id !== expenseId),
      };
    });
  }

  function submitBusinessEntry(event) {
    event.preventDefault();
    const amount = parseAmount(businessForm.amount);
    if (!amount || !businessForm.concept.trim()) return;

    const entry = {
      id: createId(),
      date: businessForm.date,
      kind: businessForm.kind,
      concept: businessForm.concept.trim(),
      amount,
      accountId: businessForm.accountId,
      notes: businessForm.notes.trim(),
    };

    const direction = entry.kind === "income" ? 1 : -1;

    setFinance((current) => ({
      ...current,
      accounts: current.accounts.map((account) =>
        account.id === entry.accountId
          ? { ...account, balance: roundCurrency(account.balance + amount * direction) }
          : account,
      ),
      businessEntries: [entry, ...current.businessEntries],
    }));
    setBusinessForm(createBusinessForm({ kind: businessForm.kind }));
  }

  function removeBusinessEntry(entryId) {
    setFinance((current) => {
      const entry = current.businessEntries.find((item) => item.id === entryId);
      if (!entry) return current;
      const direction = entry.kind === "income" ? -1 : 1;

      return {
        ...current,
        accounts: current.accounts.map((account) =>
          account.id === entry.accountId
            ? { ...account, balance: roundCurrency(account.balance + entry.amount * direction) }
            : account,
        ),
        businessEntries: current.businessEntries.filter((item) => item.id !== entryId),
      };
    });
  }

  function submitDebt(event) {
    event.preventDefault();
    const amount = parseAmount(debtForm.amount);
    if (!amount || !debtForm.person.trim()) return;

    const debt = {
      id: createId(),
      direction: debtForm.direction,
      person: debtForm.person.trim(),
      amount,
      dueDate: debtForm.dueDate,
      status: "open",
      notes: debtForm.notes.trim(),
    };

    setFinance((current) => ({
      ...current,
      debts: [debt, ...current.debts],
    }));
    setDebtForm(createDebtForm({ direction: debtForm.direction }));
  }

  function toggleDebt(debtId) {
    setFinance((current) => ({
      ...current,
      debts: current.debts.map((debt) =>
        debt.id === debtId
          ? { ...debt, status: debt.status === "open" ? "paid" : "open" }
          : debt,
      ),
    }));
  }

  function removeDebt(debtId) {
    setFinance((current) => ({
      ...current,
      debts: current.debts.filter((debt) => debt.id !== debtId),
    }));
  }

  function submitPayroll(event) {
    event.preventDefault();
    const salary = parseAmount(payrollForm.salary);
    const savings = parseAmount(payrollForm.savings);
    const investment = parseAmount(payrollForm.investment);
    if (!salary) return;

    const incomeMovement = {
      id: createId(),
      type: "income",
      date: payrollForm.date,
      accountId: payrollForm.accountId,
      toAccountId: "",
      category: "Nómina",
      amount: salary,
      notes: payrollForm.notes.trim() || "Nómina recibida",
    };
    const movements = [incomeMovement];

    if (savings > 0 && payrollForm.savingsAccountId !== payrollForm.accountId) {
      movements.push({
        id: createId(),
        type: "transfer",
        date: payrollForm.date,
        accountId: payrollForm.accountId,
        toAccountId: payrollForm.savingsAccountId,
        category: "Ahorro",
        amount: savings,
        notes: "Ahorro automático de nómina",
      });
    }

    if (investment > 0) {
      movements.push({
        id: createId(),
        type: "expense",
        date: payrollForm.date,
        accountId: payrollForm.accountId,
        toAccountId: "",
        category: "Inversión",
        amount: investment,
        notes: "Inversión automática de nómina",
      });
    }

    const entry = {
      id: createId(),
      date: payrollForm.date,
      salary,
      savings,
      investment,
      accountId: payrollForm.accountId,
      savingsAccountId: payrollForm.savingsAccountId,
      notes: payrollForm.notes.trim(),
      movementIds: movements.map((movement) => movement.id),
    };

    setFinance((current) => ({
      ...current,
      salaryPlan: {
        ...current.salaryPlan,
        salary,
        savings,
        investment,
        accountId: payrollForm.accountId,
        savingsAccountId: payrollForm.savingsAccountId,
      },
      accounts: movements.reduce(
        (accounts, movement) => applyMovementToAccounts(accounts, movement, 1),
        current.accounts,
      ),
      movements: [...movements, ...current.movements],
      payrollEntries: [entry, ...(current.payrollEntries ?? [])],
    }));

    setPayrollForm(
      createPayrollForm({
        accountId: payrollForm.accountId,
        investment,
        salary,
        savings,
        savingsAccountId: payrollForm.savingsAccountId,
      }),
    );
  }

  function removePayrollEntry(entryId) {
    setFinance((current) => {
      const entry = (current.payrollEntries ?? []).find((item) => item.id === entryId);
      if (!entry) return current;
      const movementIds = entry.movementIds ?? [];
      const linkedMovements = current.movements.filter((movement) => movementIds.includes(movement.id));

      return {
        ...current,
        accounts: linkedMovements.reduce(
          (accounts, movement) => applyMovementToAccounts(accounts, movement, -1),
          current.accounts,
        ),
        movements: current.movements.filter((movement) => !movementIds.includes(movement.id)),
        payrollEntries: (current.payrollEntries ?? []).filter((item) => item.id !== entryId),
      };
    });
  }

  function updateAccountBalance(accountId, balance) {
    setFinance((current) => ({
      ...current,
      accounts: current.accounts.map((account) =>
        account.id === accountId ? { ...account, balance: parseAmount(balance) } : account,
      ),
    }));
  }

  function updateSalaryPlan(field, value) {
    setFinance((current) => ({
      ...current,
      salaryPlan: {
        ...current.salaryPlan,
        [field]: ["salary", "payday", "savings", "investment"].includes(field)
          ? parseAmount(value)
          : value,
      },
    }));
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(finance, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `finanzas-backup-${todayInput}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function importData(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result);
        setFinance(normalizeFinance(imported));
      } catch {
        window.alert("No he podido leer ese JSON. Revisa que sea una copia exportada desde la app.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  function resetDemoData() {
    setFinance(defaultFinance);
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col lg:flex-row">
        <aside className="hidden w-72 shrink-0 border-r border-white/70 bg-white/85 px-5 py-6 shadow-sm backdrop-blur lg:block">
          <Brand />
          <nav className="mt-8 space-y-2">
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                tab={tab}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </nav>
          <InstallHint />
        </aside>

        <main className="flex-1 pb-24 lg:pb-0">
          <header className="sticky top-0 z-20 border-b border-white/70 bg-slate-100/85 px-4 py-4 backdrop-blur lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <Brand compact />
              <button
                className="rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800"
                onClick={() => setActiveTab("movements")}
                type="button"
              >
                <span className="inline-flex items-center gap-2">
                  <Plus size={18} />
                  Añadir
                </span>
              </button>
            </div>
          </header>

          <section className="px-4 py-5 lg:px-8 lg:py-8">
            {activeTab === "dashboard" && (
              <DashboardView
                accountMap={accountMap}
                allocationData={allocationData}
                finance={finance}
                ledger={ledger}
                monthlyFlowData={monthlyFlowData}
                nextFixed={nextFixed}
                setActiveTab={setActiveTab}
                totals={totals}
              />
            )}

            {activeTab === "movements" && (
              <MovementsView
                accountMap={accountMap}
                finance={finance}
                form={movementForm}
                removeMovement={removeMovement}
                setForm={setMovementForm}
                submitMovement={submitMovement}
              />
            )}

            {activeTab === "fixed" && (
              <FixedView
                accountMap={accountMap}
                finance={finance}
                form={fixedForm}
                markFixedPaid={markFixedPaid}
                removeFixed={removeFixed}
                setForm={setFixedForm}
                submitFixed={submitFixed}
              />
            )}

            {activeTab === "car" && (
              <CarView
                accountMap={accountMap}
                finance={finance}
                form={carForm}
                removeCarExpense={removeCarExpense}
                setForm={setCarForm}
                submitCarExpense={submitCarExpense}
              />
            )}

            {activeTab === "business" && (
              <BusinessView
                accountMap={accountMap}
                finance={finance}
                form={businessForm}
                removeBusinessEntry={removeBusinessEntry}
                setForm={setBusinessForm}
                submitBusinessEntry={submitBusinessEntry}
              />
            )}

            {activeTab === "payroll" && (
              <PayrollView
                accountMap={accountMap}
                finance={finance}
                form={payrollForm}
                removePayrollEntry={removePayrollEntry}
                setForm={setPayrollForm}
                submitPayroll={submitPayroll}
                totals={totals}
                updateSalaryPlan={updateSalaryPlan}
              />
            )}

            {activeTab === "debts" && (
              <DebtsView
                finance={finance}
                form={debtForm}
                removeDebt={removeDebt}
                setForm={setDebtForm}
                submitDebt={submitDebt}
                toggleDebt={toggleDebt}
              />
            )}

            {activeTab === "settings" && (
              <SettingsView
                exportData={exportData}
                finance={finance}
                importData={importData}
                resetDemoData={resetDemoData}
                updateAccountBalance={updateAccountBalance}
              />
            )}
          </section>
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 shadow-2xl shadow-slate-900/10 backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-8 gap-1">
          {tabs.map((tab) => (
            <MobileTabButton
              key={tab.id}
              tab={tab}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </div>
      </nav>
    </div>
  );
}

function DashboardView({
  accountMap,
  allocationData,
  finance,
  ledger,
  monthlyFlowData,
  nextFixed,
  setActiveTab,
  totals,
}) {
  const recentLedger = [...ledger]
    .sort((first, second) => parseDate(second.date) - parseDate(first.date))
    .slice(0, 5);
  const paydayDate = getNextPayday(finance.salaryPlan.payday);
  const availableAfterPlan = Math.max(
    finance.salaryPlan.salary -
      finance.salaryPlan.savings -
      finance.salaryPlan.investment -
      totals.fixedMonthly,
    0,
  );

  return (
    <div className="space-y-5">
      <section className="rounded-[2rem] bg-gradient-to-br from-blue-800 via-blue-700 to-sky-500 p-5 text-white shadow-2xl shadow-blue-800/20 md:p-7">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-100">Panel financiero personal</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">
              {formatCurrency(totals.totalBalance)}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-blue-50">
              Balance total entre BBVA, Openbank y efectivo. Este mes vas en{" "}
              <strong>{formatCurrency(totals.monthNet)}</strong> netos.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:min-w-80">
            <HeroMetric label="Ingresos mes" value={formatCurrency(totals.monthIncome)} />
            <HeroMetric label="Gastos mes" value={formatCurrency(totals.monthExpense)} />
            <HeroMetric label="Fijos/mes" value={formatCurrency(totals.fixedMonthly)} />
            <HeroMetric label="Libre estimado" value={formatCurrency(availableAfterPlan)} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {finance.accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel
          action={
            <button className="link-button" onClick={() => setActiveTab("payroll")} type="button">
              Abrir nómina
            </button>
          }
          eyebrow="Nómina"
          icon={PiggyBank}
          title="Reparto de nómina"
        >
          <div className="grid gap-4 md:grid-cols-[220px_1fr]">
            <AllocationDonut data={allocationData} />
            <div className="space-y-3">
              <InfoRow label={`Próxima nómina: ${formatDate(paydayDate)}`} value={formatCurrency(finance.salaryPlan.salary)} />
              <InfoRow label="Ahorro a Openbank" value={formatCurrency(finance.salaryPlan.savings)} />
              <InfoRow label="Inversión prevista" value={formatCurrency(finance.salaryPlan.investment)} />
              <InfoRow label="Gasto fijo medio" value={formatCurrency(totals.fixedMonthly)} />
              <div className="rounded-2xl bg-blue-50 p-4 text-sm text-blue-950">
                Tras apartar ahorro, inversión y fijos, te quedarían{" "}
                <strong>{formatCurrency(availableAfterPlan)}</strong> para compras, ocio e imprevistos.
              </div>
            </div>
          </div>
        </Panel>

        <Panel eyebrow="Este mes" icon={ReceiptText} title="Flujo mensual">
          <MonthlyFlowChart data={monthlyFlowData} />
        </Panel>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Panel
          action={
            <button className="link-button" onClick={() => setActiveTab("fixed")} type="button">
              Ver fijos
            </button>
          }
          eyebrow="Calendario"
          icon={CalendarDays}
          title="Próximos pagos"
        >
          <div className="space-y-3">
            {nextFixed.map((expense) => (
              <PaymentRow
                accountMap={accountMap}
                expense={expense}
                key={expense.id}
              />
            ))}
          </div>
        </Panel>

        <Panel
          action={
            <button className="link-button" onClick={() => setActiveTab("movements")} type="button">
              Añadir
            </button>
          }
          eyebrow="Actividad"
          icon={RefreshCw}
          title="Últimos movimientos"
        >
          <div className="space-y-3">
            {recentLedger.map((item) => (
              <LedgerRow accountMap={accountMap} item={item} key={item.id} />
            ))}
          </div>
        </Panel>
      </section>
    </div>
  );
}

function MovementsView({ accountMap, finance, form, removeMovement, setForm, submitMovement }) {
  const [filters, setFilters] = useState(createMovementFilters());
  const filteredMovements = finance.movements.filter((movement) =>
    matchesMovementFilters(movement, filters),
  );
  const summary = moneySummary(filteredMovements);
  const categoryOptionsForFilters = uniqueOptions(finance.movements.map((movement) => movement.category));

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <Panel eyebrow="Registro" icon={Plus} title="Nuevo movimiento">
          <form className="form-grid" onSubmit={submitMovement}>
            <SelectField
              label="Tipo"
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  type: value,
                  category: categoryOptions[value][0],
                }))
              }
              options={[
                { value: "income", label: "Ingreso" },
                { value: "expense", label: "Gasto" },
                { value: "transfer", label: "Traspaso" },
              ]}
              value={form.type}
            />
            <DateField
              label="Fecha"
              onChange={(value) => setForm((current) => ({ ...current, date: value }))}
              value={form.date}
            />
            <CurrencyField
              label="Importe"
              onChange={(value) => setForm((current) => ({ ...current, amount: value }))}
              value={form.amount}
            />
            <SelectField
              label={form.type === "transfer" ? "Desde" : "Cuenta"}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  accountId: value,
                  toAccountId:
                    current.toAccountId === value
                      ? finance.accounts.find((account) => account.id !== value)?.id ?? ""
                      : current.toAccountId,
                }))
              }
              options={finance.accounts.map((account) => ({ value: account.id, label: account.name }))}
              value={form.accountId}
            />
            {form.type === "transfer" && (
              <SelectField
                label="Hacia"
                onChange={(value) => setForm((current) => ({ ...current, toAccountId: value }))}
                options={finance.accounts
                  .filter((account) => account.id !== form.accountId)
                  .map((account) => ({ value: account.id, label: account.name }))}
                value={form.toAccountId}
              />
            )}
            <SelectField
              label="Categoría"
              onChange={(value) => setForm((current) => ({ ...current, category: value }))}
              options={categoryOptions[form.type].map((category) => ({
                value: category,
                label: category,
              }))}
              value={form.category}
            />
            <TextField
              label="Notas"
              onChange={(value) => setForm((current) => ({ ...current, notes: value }))}
              placeholder="Ej. nómina, compra, transferencia..."
              value={form.notes}
            />
            <button className="primary-button md:col-span-2" type="submit">
              Guardar movimiento
            </button>
          </form>
        </Panel>

        <FilterPanel onClear={() => setFilters(createMovementFilters())} title="Buscar movimientos">
          <SelectField
            label="Tipo"
            onChange={(value) => setFilters((current) => ({ ...current, type: value }))}
            options={[
              { value: "all", label: "Todos" },
              { value: "income", label: "Ingresos" },
              { value: "expense", label: "Gastos" },
              { value: "transfer", label: "Traspasos" },
            ]}
            value={filters.type}
          />
          <SelectField
            label="Categoría"
            onChange={(value) => setFilters((current) => ({ ...current, category: value }))}
            options={[{ value: "all", label: "Todas" }, ...categoryOptionsForFilters]}
            value={filters.category}
          />
          <SelectField
            label="Cuenta"
            onChange={(value) => setFilters((current) => ({ ...current, accountId: value }))}
            options={[
              { value: "all", label: "Todas" },
              ...finance.accounts.map((account) => ({ value: account.id, label: account.name })),
            ]}
            value={filters.accountId}
          />
          <DateField
            label="Desde"
            onChange={(value) => setFilters((current) => ({ ...current, dateFrom: value }))}
            value={filters.dateFrom}
          />
          <DateField
            label="Hasta"
            onChange={(value) => setFilters((current) => ({ ...current, dateTo: value }))}
            value={filters.dateTo}
          />
          <TextField
            label="Buscar texto"
            onChange={(value) => setFilters((current) => ({ ...current, query: value }))}
            placeholder="Notas, categoría, cervezas..."
            value={filters.query}
          />
        </FilterPanel>
      </div>

      <ResultMetrics
        count={filteredMovements.length}
        itemsLabel="movimientos"
        primaryLabel="Ingresos filtrados"
        primaryValue={formatCurrency(summary.income)}
        secondaryLabel="Gastos filtrados"
        secondaryValue={formatCurrency(summary.expense)}
        tertiaryLabel="Neto filtrado"
        tertiaryValue={formatCurrency(summary.net)}
      />

      <Panel eyebrow="Historial" icon={CreditCard} title="Movimientos filtrados">
        <div className="space-y-3">
          {filteredMovements.length ? (
            filteredMovements.map((movement) => (
              <LedgerRow
                accountMap={accountMap}
                item={movement}
                key={movement.id}
                onDelete={() => removeMovement(movement.id)}
              />
            ))
          ) : (
            <EmptyState text="No hay movimientos que coincidan con esos filtros." />
          )}
        </div>
      </Panel>
    </div>
  );
}

function FixedView({ accountMap, finance, form, markFixedPaid, removeFixed, setForm, submitFixed }) {
  const [filters, setFilters] = useState(createFixedFilters());
  const filteredFixed = [...finance.fixedExpenses]
    .filter((expense) => matchesFixedFilters(expense, filters))
    .sort((first, second) => parseDate(first.nextDate) - parseDate(second.nextDate));
  const total = filteredFixed.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const monthly = filteredFixed.reduce((sum, expense) => sum + monthlyEquivalent(expense), 0);

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <Panel eyebrow="Calendario" icon={CalendarDays} title="Nuevo gasto fijo">
          <form className="form-grid" onSubmit={submitFixed}>
            <TextField
              label="Nombre"
              onChange={(value) => setForm((current) => ({ ...current, name: value }))}
              placeholder="Ej. gimnasio, seguro, Spotify..."
              value={form.name}
            />
            <CurrencyField
              label="Importe"
              onChange={(value) => setForm((current) => ({ ...current, amount: value }))}
              value={form.amount}
            />
            <DateField
              label="Próximo pago"
              onChange={(value) => setForm((current) => ({ ...current, nextDate: value }))}
              value={form.nextDate}
            />
            <SelectField
              label="Periodicidad"
              onChange={(value) => setForm((current) => ({ ...current, frequency: value }))}
              options={[
                { value: "monthly", label: "Mensual" },
                { value: "quarterly", label: "Trimestral" },
                { value: "yearly", label: "Anual" },
                { value: "custom", label: "Puntual" },
              ]}
              value={form.frequency}
            />
            <SelectField
              label="Cuenta"
              onChange={(value) => setForm((current) => ({ ...current, accountId: value }))}
              options={finance.accounts.map((account) => ({ value: account.id, label: account.name }))}
              value={form.accountId}
            />
            <SelectField
              label="Categoría"
              onChange={(value) => setForm((current) => ({ ...current, category: value }))}
              options={fixedCategories.map((category) => ({ value: category, label: category }))}
              value={form.category}
            />
            <TextField
              label="Notas"
              onChange={(value) => setForm((current) => ({ ...current, notes: value }))}
              placeholder="Día de pago, detalles, etc."
              value={form.notes}
            />
            <button className="primary-button md:col-span-2" type="submit">
              Guardar fijo
            </button>
          </form>
        </Panel>

        <FilterPanel onClear={() => setFilters(createFixedFilters())} title="Buscar gastos fijos">
          <SelectField
            label="Categoría"
            onChange={(value) => setFilters((current) => ({ ...current, category: value }))}
            options={[
              { value: "all", label: "Todas" },
              ...uniqueOptions(finance.fixedExpenses.map((expense) => expense.category)),
            ]}
            value={filters.category}
          />
          <SelectField
            label="Periodicidad"
            onChange={(value) => setFilters((current) => ({ ...current, frequency: value }))}
            options={[
              { value: "all", label: "Todas" },
              { value: "monthly", label: "Mensual" },
              { value: "quarterly", label: "Trimestral" },
              { value: "yearly", label: "Anual" },
              { value: "custom", label: "Puntual" },
            ]}
            value={filters.frequency}
          />
          <SelectField
            label="Cuenta"
            onChange={(value) => setFilters((current) => ({ ...current, accountId: value }))}
            options={[
              { value: "all", label: "Todas" },
              ...finance.accounts.map((account) => ({ value: account.id, label: account.name })),
            ]}
            value={filters.accountId}
          />
          <DateField
            label="Desde"
            onChange={(value) => setFilters((current) => ({ ...current, dateFrom: value }))}
            value={filters.dateFrom}
          />
          <DateField
            label="Hasta"
            onChange={(value) => setFilters((current) => ({ ...current, dateTo: value }))}
            value={filters.dateTo}
          />
          <TextField
            label="Buscar texto"
            onChange={(value) => setFilters((current) => ({ ...current, query: value }))}
            placeholder="Nombre, notas, categoría..."
            value={filters.query}
          />
        </FilterPanel>
      </div>

      <ResultMetrics
        count={filteredFixed.length}
        itemsLabel="fijos"
        primaryLabel="Importe de pagos"
        primaryValue={formatCurrency(total)}
        secondaryLabel="Equivalente mensual"
        secondaryValue={formatCurrency(monthly)}
        tertiaryLabel="Próximo"
        tertiaryValue={filteredFixed[0] ? formatDate(filteredFixed[0].nextDate) : "Sin datos"}
      />

      <Panel eyebrow="Control" icon={Repeat2} title="Gastos fijos filtrados">
        <div className="space-y-3">
          {filteredFixed.length ? (
            filteredFixed.map((expense) => (
              <div className="list-row" key={expense.id}>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-950">{expense.name}</p>
                    <StatusPill date={expense.nextDate} />
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {formatDate(expense.nextDate)} · {frequencyLabels[expense.frequency]} ·{" "}
                    {accountMap[expense.accountId]?.name}
                  </p>
                  {expense.notes && <p className="mt-1 text-sm text-slate-400">{expense.notes}</p>}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <p className="text-right font-bold text-slate-950">{formatCurrency(expense.amount)}</p>
                  <button
                    className="icon-button text-blue-700"
                    onClick={() => markFixedPaid(expense.id)}
                    title="Marcar como pagado"
                    type="button"
                  >
                    <CheckCircle2 size={18} />
                  </button>
                  <button
                    className="icon-button text-slate-400 hover:text-red-600"
                    onClick={() => removeFixed(expense.id)}
                    title="Eliminar"
                    type="button"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <EmptyState text="No hay gastos fijos que coincidan con esos filtros." />
          )}
        </div>
      </Panel>
    </div>
  );
}

function CarView({ accountMap, finance, form, removeCarExpense, setForm, submitCarExpense }) {
  const [filters, setFilters] = useState(createCarFilters());
  const filteredCarExpenses = finance.carExpenses.filter((expense) => matchesCarFilters(expense, filters));
  const total = filteredCarExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const byCategory = groupByAmount(filteredCarExpenses, "category").slice(0, 5);

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard icon={Car} label="Gasto filtrado" value={formatCurrency(total)} />
        <MetricCard
          icon={ReceiptText}
          label="Registros filtrados"
          value={`${filteredCarExpenses.length}`}
        />
        <MetricCard
          icon={Target}
          label="Categoría principal"
          value={byCategory[0]?.name ?? "Sin datos"}
        />
      </section>

      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <Panel eyebrow="Coche" icon={Plus} title="Nuevo gasto del coche">
          <form className="form-grid" onSubmit={submitCarExpense}>
            <DateField
              label="Fecha"
              onChange={(value) => setForm((current) => ({ ...current, date: value }))}
              value={form.date}
            />
            <SelectField
              label="Categoría"
              onChange={(value) => setForm((current) => ({ ...current, category: value }))}
              options={carCategories.map((category) => ({ value: category, label: category }))}
              value={form.category}
            />
            <CurrencyField
              label="Importe"
              onChange={(value) => setForm((current) => ({ ...current, amount: value }))}
              value={form.amount}
            />
            <SelectField
              label="Cuenta"
              onChange={(value) => setForm((current) => ({ ...current, accountId: value }))}
              options={finance.accounts.map((account) => ({ value: account.id, label: account.name }))}
              value={form.accountId}
            />
            <TextField
              label="Notas"
              onChange={(value) => setForm((current) => ({ ...current, notes: value }))}
              placeholder="Ej. ITV, limpieza, avería, revisión..."
              value={form.notes}
            />
            <button className="primary-button md:col-span-2" type="submit">
              Guardar gasto de coche
            </button>
          </form>
        </Panel>

        <FilterPanel onClear={() => setFilters(createCarFilters())} title="Buscar gastos de coche">
          <SelectField
            label="Categoría"
            onChange={(value) => setFilters((current) => ({ ...current, category: value }))}
            options={[{ value: "all", label: "Todas" }, ...carCategories.map((category) => ({ value: category, label: category }))]}
            value={filters.category}
          />
          <SelectField
            label="Cuenta"
            onChange={(value) => setFilters((current) => ({ ...current, accountId: value }))}
            options={[
              { value: "all", label: "Todas" },
              ...finance.accounts.map((account) => ({ value: account.id, label: account.name })),
            ]}
            value={filters.accountId}
          />
          <DateField
            label="Desde"
            onChange={(value) => setFilters((current) => ({ ...current, dateFrom: value }))}
            value={filters.dateFrom}
          />
          <DateField
            label="Hasta"
            onChange={(value) => setFilters((current) => ({ ...current, dateTo: value }))}
            value={filters.dateTo}
          />
          <TextField
            label="Buscar texto"
            onChange={(value) => setFilters((current) => ({ ...current, query: value }))}
            placeholder="Notas, limpieza, gasolina..."
            value={filters.query}
          />
        </FilterPanel>
      </div>

      <Panel eyebrow="Historial" icon={Car} title="Gastos del coche filtrados">
        <div className="space-y-3">
          {filteredCarExpenses.length ? (
            filteredCarExpenses.map((expense) => (
              <SimpleMoneyRow
                account={accountMap[expense.accountId]?.name}
                amount={expense.amount}
                date={expense.date}
                key={expense.id}
                label={expense.category}
                notes={expense.notes}
                onDelete={() => removeCarExpense(expense.id)}
                tone="expense"
              />
            ))
          ) : (
            <EmptyState text="No hay gastos de coche que coincidan con esos filtros." />
          )}
        </div>
      </Panel>
    </div>
  );
}

function PayrollView({
  accountMap,
  finance,
  form,
  removePayrollEntry,
  setForm,
  submitPayroll,
  totals,
  updateSalaryPlan,
}) {
  const payrollEntries = finance.payrollEntries ?? [];
  const expectedSalary = parseAmount(form.salary) || finance.salaryPlan.salary;
  const expectedFree = Math.max(
    expectedSalary - finance.salaryPlan.savings - finance.salaryPlan.investment - totals.fixedMonthly,
    0,
  );

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard icon={PiggyBank} label="Última nómina" value={formatCurrency(finance.salaryPlan.salary)} />
        <MetricCard icon={ArrowUpRight} label="A Openbank" value={formatCurrency(finance.salaryPlan.savings)} />
        <MetricCard icon={Target} label="A inversión" value={formatCurrency(finance.salaryPlan.investment)} />
        <MetricCard icon={Wallet} label="Libre estimado" value={formatCurrency(expectedFree)} />
      </section>

      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <Panel eyebrow="Plan" icon={Target} title="Reglas de nómina">
          <div className="form-grid">
            <CurrencyField
              label="Referencia / última nómina"
              onChange={(value) => {
                updateSalaryPlan("salary", value);
                setForm((current) => ({ ...current, salary: value }));
              }}
              value={finance.salaryPlan.salary}
            />
            <TextField
              label="Día habitual de cobro"
              max="31"
              min="1"
              onChange={(value) => updateSalaryPlan("payday", value)}
              type="number"
              value={finance.salaryPlan.payday}
            />
            <CurrencyField
              label="Ahorro automático"
              onChange={(value) => {
                updateSalaryPlan("savings", value);
                setForm((current) => ({ ...current, savings: value }));
              }}
              value={finance.salaryPlan.savings}
            />
            <CurrencyField
              label="Inversión automática"
              onChange={(value) => {
                updateSalaryPlan("investment", value);
                setForm((current) => ({ ...current, investment: value }));
              }}
              value={finance.salaryPlan.investment}
            />
            <SelectField
              label="Cuenta de entrada"
              onChange={(value) => {
                updateSalaryPlan("accountId", value);
                setForm((current) => ({ ...current, accountId: value }));
              }}
              options={finance.accounts.map((account) => ({ value: account.id, label: account.name }))}
              value={finance.salaryPlan.accountId}
            />
            <SelectField
              label="Cuenta ahorro"
              onChange={(value) => {
                updateSalaryPlan("savingsAccountId", value);
                setForm((current) => ({ ...current, savingsAccountId: value }));
              }}
              options={finance.accounts.map((account) => ({ value: account.id, label: account.name }))}
              value={finance.salaryPlan.savingsAccountId}
            />
          </div>
          <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm leading-6 text-blue-950">
            Cuando registres la nómina real, se añadirá un ingreso en {accountMap[finance.salaryPlan.accountId]?.name},
            un traspaso de ahorro a {accountMap[finance.salaryPlan.savingsAccountId]?.name} y una salida de inversión.
          </div>
        </Panel>

        <Panel eyebrow="Cobro" icon={PiggyBank} title="Registrar nómina recibida">
          <form className="form-grid" onSubmit={submitPayroll}>
            <DateField
              label="Fecha de cobro"
              onChange={(value) => setForm((current) => ({ ...current, date: value }))}
              value={form.date}
            />
            <CurrencyField
              label="Importe real recibido"
              onChange={(value) => setForm((current) => ({ ...current, salary: value }))}
              value={form.salary}
            />
            <CurrencyField
              label="Ahorro a Openbank"
              onChange={(value) => setForm((current) => ({ ...current, savings: value }))}
              value={form.savings}
            />
            <CurrencyField
              label="Inversión"
              onChange={(value) => setForm((current) => ({ ...current, investment: value }))}
              value={form.investment}
            />
            <SelectField
              label="Entra en"
              onChange={(value) => setForm((current) => ({ ...current, accountId: value }))}
              options={finance.accounts.map((account) => ({ value: account.id, label: account.name }))}
              value={form.accountId}
            />
            <SelectField
              label="Ahorro hacia"
              onChange={(value) => setForm((current) => ({ ...current, savingsAccountId: value }))}
              options={finance.accounts.map((account) => ({ value: account.id, label: account.name }))}
              value={form.savingsAccountId}
            />
            <TextField
              label="Notas"
              onChange={(value) => setForm((current) => ({ ...current, notes: value }))}
              placeholder="Ej. nómina julio, bonus, ajuste..."
              value={form.notes}
            />
            <button className="primary-button md:col-span-2" type="submit">
              Registrar nómina y automatismos
            </button>
          </form>
        </Panel>
      </div>

      <Panel
        action={<span className="text-sm font-bold text-slate-400">{payrollEntries.length} registros</span>}
        eyebrow="Historial"
        icon={ReceiptText}
        title="Nóminas registradas"
      >
        <div className="space-y-3">
          {payrollEntries.length ? (
            payrollEntries.map((entry) => (
              <div className="list-row" key={entry.id}>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-950">Nómina · {formatDate(entry.date)}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {accountMap[entry.accountId]?.name} · ahorro {formatCurrency(entry.savings)} · inversión{" "}
                    {formatCurrency(entry.investment)}
                  </p>
                  {entry.notes && <p className="mt-1 text-sm text-slate-400">{entry.notes}</p>}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <p className="text-right font-bold text-emerald-600">+{formatCurrency(entry.salary)}</p>
                  <button
                    className="icon-button text-slate-400 hover:text-red-600"
                    onClick={() => removePayrollEntry(entry.id)}
                    title="Deshacer nómina"
                    type="button"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <EmptyState text="Todavía no has registrado ninguna nómina desde esta pestaña." />
          )}
        </div>
      </Panel>
    </div>
  );
}

function BusinessView({ accountMap, finance, form, removeBusinessEntry, setForm, submitBusinessEntry }) {
  const [filters, setFilters] = useState(createBusinessFilters());
  const filteredEntries = finance.businessEntries.filter((entry) => matchesBusinessFilters(entry, filters));
  const income = filteredEntries
    .filter((entry) => entry.kind === "income")
    .reduce((sum, entry) => sum + entry.amount, 0);
  const expense = filteredEntries
    .filter((entry) => entry.kind === "expense")
    .reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard icon={ArrowUpRight} label="Ingresos filtrados" value={formatCurrency(income)} />
        <MetricCard icon={ArrowDownRight} label="Gastos filtrados" value={formatCurrency(expense)} />
        <MetricCard icon={Briefcase} label="Neto filtrado" value={formatCurrency(income - expense)} />
      </section>

      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <Panel eyebrow="Negocio" icon={Briefcase} title="Nuevo apunte">
          <form className="form-grid" onSubmit={submitBusinessEntry}>
            <SelectField
              label="Tipo"
              onChange={(value) => setForm((current) => ({ ...current, kind: value }))}
              options={[
                { value: "income", label: "Ingreso" },
                { value: "expense", label: "Gasto" },
              ]}
              value={form.kind}
            />
            <DateField
              label="Fecha"
              onChange={(value) => setForm((current) => ({ ...current, date: value }))}
              value={form.date}
            />
            <TextField
              label="Concepto"
              onChange={(value) => setForm((current) => ({ ...current, concept: value }))}
              placeholder="Ej. venta, servicio, herramienta..."
              value={form.concept}
            />
            <CurrencyField
              label="Importe"
              onChange={(value) => setForm((current) => ({ ...current, amount: value }))}
              value={form.amount}
            />
            <SelectField
              label="Cuenta"
              onChange={(value) => setForm((current) => ({ ...current, accountId: value }))}
              options={finance.accounts.map((account) => ({ value: account.id, label: account.name }))}
              value={form.accountId}
            />
            <TextField
              label="Notas"
              onChange={(value) => setForm((current) => ({ ...current, notes: value }))}
              placeholder="Detalles del ingreso o gasto"
              value={form.notes}
            />
            <button className="primary-button md:col-span-2" type="submit">
              Guardar apunte
            </button>
          </form>
        </Panel>

        <FilterPanel onClear={() => setFilters(createBusinessFilters())} title="Buscar negocio">
          <SelectField
            label="Tipo"
            onChange={(value) => setFilters((current) => ({ ...current, kind: value }))}
            options={[
              { value: "all", label: "Todos" },
              { value: "income", label: "Ingresos" },
              { value: "expense", label: "Gastos" },
            ]}
            value={filters.kind}
          />
          <SelectField
            label="Cuenta"
            onChange={(value) => setFilters((current) => ({ ...current, accountId: value }))}
            options={[
              { value: "all", label: "Todas" },
              ...finance.accounts.map((account) => ({ value: account.id, label: account.name })),
            ]}
            value={filters.accountId}
          />
          <DateField
            label="Desde"
            onChange={(value) => setFilters((current) => ({ ...current, dateFrom: value }))}
            value={filters.dateFrom}
          />
          <DateField
            label="Hasta"
            onChange={(value) => setFilters((current) => ({ ...current, dateTo: value }))}
            value={filters.dateTo}
          />
          <TextField
            label="Buscar texto"
            onChange={(value) => setFilters((current) => ({ ...current, query: value }))}
            placeholder="Concepto, notas, cliente..."
            value={filters.query}
          />
        </FilterPanel>
      </div>

      <Panel eyebrow="Historial" icon={ReceiptText} title="Ingresos y gastos filtrados">
        <div className="space-y-3">
          {filteredEntries.length ? (
            filteredEntries.map((entry) => (
              <SimpleMoneyRow
                account={accountMap[entry.accountId]?.name}
                amount={entry.amount}
                date={entry.date}
                key={entry.id}
                label={entry.concept}
                notes={entry.notes}
                onDelete={() => removeBusinessEntry(entry.id)}
                tone={entry.kind === "income" ? "income" : "expense"}
              />
            ))
          ) : (
            <EmptyState text="No hay apuntes de negocio que coincidan con esos filtros." />
          )}
        </div>
      </Panel>
    </div>
  );
}

function DebtsView({ finance, form, removeDebt, setForm, submitDebt, toggleDebt }) {
  const [filters, setFilters] = useState(createDebtFilters());
  const filteredDebts = finance.debts.filter((debt) => matchesDebtFilters(debt, filters));
  const favor = filteredDebts
    .filter((debt) => debt.direction === "favor" && debt.status === "open")
    .reduce((sum, debt) => sum + debt.amount, 0);
  const contra = filteredDebts
    .filter((debt) => debt.direction === "contra" && debt.status === "open")
    .reduce((sum, debt) => sum + debt.amount, 0);

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard icon={ArrowUpRight} label="Me deben filtrado" value={formatCurrency(favor)} />
        <MetricCard icon={ArrowDownRight} label="Debo filtrado" value={formatCurrency(contra)} />
        <MetricCard
          icon={HandCoins}
          label="Balance filtrado"
          value={formatCurrency(favor - contra)}
        />
      </section>

      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <Panel eyebrow="Deudas" icon={HandCoins} title="Nueva deuda">
          <form className="form-grid" onSubmit={submitDebt}>
            <SelectField
              label="Tipo"
              onChange={(value) => setForm((current) => ({ ...current, direction: value }))}
              options={[
                { value: "favor", label: "A mi favor" },
                { value: "contra", label: "En mi contra" },
              ]}
              value={form.direction}
            />
            <TextField
              label="Persona / entidad"
              onChange={(value) => setForm((current) => ({ ...current, person: value }))}
              placeholder="Nombre"
              value={form.person}
            />
            <CurrencyField
              label="Importe"
              onChange={(value) => setForm((current) => ({ ...current, amount: value }))}
              value={form.amount}
            />
            <DateField
              label="Fecha límite"
              onChange={(value) => setForm((current) => ({ ...current, dueDate: value }))}
              value={form.dueDate}
            />
            <TextField
              label="Notas"
              onChange={(value) => setForm((current) => ({ ...current, notes: value }))}
              placeholder="Motivo o acuerdo"
              value={form.notes}
            />
            <button className="primary-button md:col-span-2" type="submit">
              Guardar deuda
            </button>
          </form>
        </Panel>

        <FilterPanel onClear={() => setFilters(createDebtFilters())} title="Buscar deudas">
          <SelectField
            label="Tipo"
            onChange={(value) => setFilters((current) => ({ ...current, direction: value }))}
            options={[
              { value: "all", label: "Todas" },
              { value: "favor", label: "A mi favor" },
              { value: "contra", label: "En mi contra" },
            ]}
            value={filters.direction}
          />
          <SelectField
            label="Estado"
            onChange={(value) => setFilters((current) => ({ ...current, status: value }))}
            options={[
              { value: "all", label: "Todas" },
              { value: "open", label: "Pendientes" },
              { value: "paid", label: "Saldadas" },
            ]}
            value={filters.status}
          />
          <DateField
            label="Desde"
            onChange={(value) => setFilters((current) => ({ ...current, dateFrom: value }))}
            value={filters.dateFrom}
          />
          <DateField
            label="Hasta"
            onChange={(value) => setFilters((current) => ({ ...current, dateTo: value }))}
            value={filters.dateTo}
          />
          <TextField
            label="Buscar texto"
            onChange={(value) => setFilters((current) => ({ ...current, query: value }))}
            placeholder="Persona, notas, motivo..."
            value={filters.query}
          />
        </FilterPanel>
      </div>

      <Panel
        action={<span className="text-sm font-bold text-slate-400">{filteredDebts.length} de {finance.debts.length}</span>}
        eyebrow="Seguimiento"
        icon={ReceiptText}
        title="Deudas filtradas"
      >
        <div className="space-y-3">
          {filteredDebts.length ? (
            filteredDebts.map((debt) => (
              <div className={`list-row ${debt.status === "paid" ? "opacity-60" : ""}`} key={debt.id}>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-950">{debt.person}</p>
                    <span
                      className={`pill ${
                        debt.direction === "favor"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {debt.direction === "favor" ? "A favor" : "En contra"}
                    </span>
                    {debt.status === "paid" && (
                      <span className="pill bg-slate-100 text-slate-500">Saldada</span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {debt.dueDate ? formatDate(debt.dueDate) : "Sin fecha"} · {debt.notes || "Sin notas"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <p className="text-right font-bold text-slate-950">{formatCurrency(debt.amount)}</p>
                  <button
                    className="icon-button text-blue-700"
                    onClick={() => toggleDebt(debt.id)}
                    title="Cambiar estado"
                    type="button"
                  >
                    <CheckCircle2 size={18} />
                  </button>
                  <button
                    className="icon-button text-slate-400 hover:text-red-600"
                    onClick={() => removeDebt(debt.id)}
                    title="Eliminar"
                    type="button"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <EmptyState text="No hay deudas que coincidan con esos filtros." />
          )}
        </div>
      </Panel>
    </div>
  );
}

function SettingsView({
  exportData,
  finance,
  importData,
  resetDemoData,
  updateAccountBalance,
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <Panel eyebrow="Cuentas" icon={Wallet} title="Saldos actuales">
        <div className="space-y-4">
          {finance.accounts.map((account) => (
            <label className="block" key={account.id}>
              <span className="field-label">{account.name}</span>
              <div className="currency-input">
                <input
                  inputMode="decimal"
                  min="0"
                  onChange={(event) => updateAccountBalance(account.id, event.target.value)}
                  step="0.01"
                  type="number"
                  value={account.balance}
                />
                <span>EUR</span>
              </div>
              <small className="mt-1 block text-slate-500">{account.role}</small>
            </label>
          ))}
        </div>
      </Panel>

      <Panel eyebrow="Datos" icon={Download} title="Copias y traspaso al iPhone">
        <div className="space-y-3">
          <p className="text-sm leading-6 text-slate-600">
            La app guarda los datos en este navegador. Exporta una copia JSON antes de moverla a otro
            dispositivo o antes de hacer cambios grandes.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="secondary-button" onClick={exportData} type="button">
              <Download size={18} />
              Exportar JSON
            </button>
            <label className="secondary-button cursor-pointer">
              <Upload size={18} />
              Importar JSON
              <input accept="application/json" className="hidden" onChange={importData} type="file" />
            </label>
            <button className="ghost-button" onClick={resetDemoData} type="button">
              Restaurar ejemplo
            </button>
          </div>
        </div>
      </Panel>

      <Panel eyebrow="iPhone" icon={Landmark} title="Instalacion rapida">
        <ol className="space-y-3 text-sm leading-6 text-slate-600">
          <li>1. Ejecuta la app y abre la URL desde Safari en el iPhone.</li>
          <li>2. Pulsa compartir y elige "Añadir a pantalla de inicio".</li>
          <li>3. Exporta/importa el JSON si cambias de navegador o dispositivo.</li>
        </ol>
      </Panel>
    </div>
  );
}

function FilterPanel({ children, onClear, title }) {
  return (
    <Panel
      action={
        <button className="link-button" onClick={onClear} type="button">
          Limpiar
        </button>
      }
      eyebrow="Filtros"
      icon={Search}
      title={title}
    >
      <div className="form-grid">{children}</div>
    </Panel>
  );
}

function ResultMetrics({
  count,
  itemsLabel,
  primaryLabel,
  primaryValue,
  secondaryLabel,
  secondaryValue,
  tertiaryLabel,
  tertiaryValue,
}) {
  return (
    <section className="grid gap-4 md:grid-cols-4">
      <MetricCard icon={Search} label="Coincidencias" value={`${count} ${itemsLabel}`} />
      <MetricCard icon={ArrowUpRight} label={primaryLabel} value={primaryValue} />
      <MetricCard icon={ArrowDownRight} label={secondaryLabel} value={secondaryValue} />
      <MetricCard icon={Target} label={tertiaryLabel} value={tertiaryValue} />
    </section>
  );
}

function EmptyState({ text }) {
  return (
    <div className="rounded-3xl bg-slate-50 p-6 text-center text-sm font-semibold text-slate-500">
      {text}
    </div>
  );
}

function Brand({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-700 text-white shadow-lg shadow-blue-700/25">
        <Banknote size={24} />
      </div>
      <div className={compact ? "lg:hidden" : ""}>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Finanzas</p>
        <h2 className="text-lg font-bold tracking-tight text-slate-950">Control Azul</h2>
      </div>
    </div>
  );
}

function InstallHint() {
  return (
    <div className="mt-8 rounded-3xl bg-blue-50 p-4 text-sm leading-6 text-blue-950">
      <p className="font-semibold">Lista para iPhone</p>
      <p className="mt-1 text-blue-900/80">
        Funciona como app web instalable y conserva tus datos en el navegador.
      </p>
    </div>
  );
}

function TabButton({ active, onClick, tab }) {
  const Icon = tab.icon;
  return (
    <button
      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
        active ? "bg-blue-700 text-white shadow-lg shadow-blue-700/20" : "text-slate-500 hover:bg-blue-50"
      }`}
      onClick={onClick}
      type="button"
    >
      <Icon size={19} />
      {tab.label}
    </button>
  );
}

function MobileTabButton({ active, onClick, tab }) {
  const Icon = tab.icon;
  return (
    <button
      className={`flex min-w-0 flex-col items-center gap-1 rounded-2xl px-0.5 py-2 text-[0.55rem] font-semibold transition ${
        active ? "bg-blue-700 text-white" : "text-slate-500"
      }`}
      onClick={onClick}
      type="button"
    >
      <Icon size={17} />
      <span className="block max-w-full truncate leading-none">{tab.shortLabel}</span>
    </button>
  );
}

function HeroMetric({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/12 p-4 ring-1 ring-white/20">
      <p className="text-xs font-medium text-blue-100">{label}</p>
      <p className="mt-1 text-lg font-bold text-white">{value}</p>
    </div>
  );
}

function AllocationDonut({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  let cursor = 0;
  const gradient = data
    .map((item) => {
      const start = cursor;
      const end = cursor + (item.value / total) * 100;
      cursor = end;
      return `${item.color} ${start}% ${end}%`;
    })
    .join(", ");

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="allocation-donut" style={{ background: `conic-gradient(${gradient})` }}>
        <div>
          <span>Plan</span>
          <strong>{formatCurrency(total)}</strong>
        </div>
      </div>
      <div className="grid w-full grid-cols-2 gap-2">
        {data.map((item) => (
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600" key={item.name}>
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
            <span className="truncate">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MonthlyFlowChart({ data }) {
  const max = Math.max(...data.map((item) => Math.abs(item.value)), 1);

  return (
    <div className="space-y-4">
      {data.map((item) => {
        const isNegative = item.value < 0;
        const isExpense = item.name === "Gastos";
        const width = `${Math.max((Math.abs(item.value) / max) * 100, 3)}%`;

        return (
          <div key={item.name}>
            <div className="mb-2 flex items-center justify-between gap-4">
              <span className="text-sm font-semibold text-slate-500">{item.name}</span>
              <strong className={isNegative || isExpense ? "text-rose-600" : "text-slate-950"}>
                {formatCurrency(item.value)}
              </strong>
            </div>
            <div className="h-3 rounded-full bg-slate-100">
              <div
                className={`h-3 rounded-full ${isNegative || isExpense ? "bg-rose-500" : "bg-blue-700"}`}
                style={{ width }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AccountCard({ account }) {
  return (
    <article className="overflow-hidden rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-500">{account.role}</p>
          <h3 className="mt-1 text-xl font-bold text-slate-950">{account.name}</h3>
        </div>
        <span
          className="h-11 w-11 rounded-2xl"
          style={{ background: accountColors[account.id] ?? "#0f67d7" }}
        />
      </div>
      <p className="mt-5 text-2xl font-bold tracking-tight">{formatCurrency(account.balance)}</p>
    </article>
  );
}

function MetricCard({ icon: Icon, label, value }) {
  return (
    <article className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-700">
          <Icon size={21} />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-1 text-xl font-bold text-slate-950">{value}</p>
        </div>
      </div>
    </article>
  );
}

function Panel({ action, children, eyebrow, icon: Icon, title }) {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-50 text-blue-700">
            <Icon size={20} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">{eyebrow}</p>
            <h2 className="text-xl font-bold tracking-tight text-slate-950">{title}</h2>
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <strong className="text-sm text-slate-950">{value}</strong>
    </div>
  );
}

function PaymentRow({ accountMap, expense }) {
  return (
    <div className="list-row">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-slate-950">{expense.name}</p>
          <StatusPill date={expense.nextDate} />
        </div>
        <p className="mt-1 text-sm text-slate-500">
          {formatDate(expense.nextDate)} · {accountMap[expense.accountId]?.name}
        </p>
      </div>
      <p className="font-bold text-slate-950">{formatCurrency(expense.amount)}</p>
    </div>
  );
}

function LedgerRow({ accountMap, item, onDelete }) {
  const isIncome = item.type === "income";
  const isTransfer = item.type === "transfer";
  const color = isIncome ? "text-emerald-600" : isTransfer ? "text-blue-700" : "text-rose-600";
  const sign = isIncome ? "+" : isTransfer ? "" : "-";
  const accountLabel = isTransfer
    ? `${accountMap[item.accountId]?.name ?? "Cuenta"} -> ${accountMap[item.toAccountId]?.name ?? "Cuenta"}`
    : accountMap[item.accountId]?.name;

  return (
    <div className="list-row">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${
            isIncome ? "bg-emerald-50 text-emerald-600" : isTransfer ? "bg-blue-50 text-blue-700" : "bg-rose-50 text-rose-600"
          }`}
        >
          {isIncome ? <ArrowUpRight size={19} /> : isTransfer ? <Repeat2 size={19} /> : <ArrowDownRight size={19} />}
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-950">{item.category}</p>
          <p className="truncate text-sm text-slate-500">
            {formatDate(item.date)} · {accountLabel}
          </p>
          {item.notes && <p className="truncate text-sm text-slate-400">{item.notes}</p>}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <p className={`text-right font-bold ${color}`}>
          {sign}
          {formatCurrency(item.amount)}
        </p>
        {onDelete && (
          <button
            className="icon-button text-slate-400 hover:text-red-600"
            onClick={onDelete}
            title="Eliminar"
            type="button"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

function SimpleMoneyRow({ account, amount, date, label, notes, onDelete, tone }) {
  const isIncome = tone === "income";
  return (
    <div className="list-row">
      <div className="min-w-0">
        <p className="truncate font-semibold text-slate-950">{label}</p>
        <p className="truncate text-sm text-slate-500">
          {formatDate(date)} · {account}
        </p>
        {notes && <p className="truncate text-sm text-slate-400">{notes}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <p className={`text-right font-bold ${isIncome ? "text-emerald-600" : "text-rose-600"}`}>
          {isIncome ? "+" : "-"}
          {formatCurrency(amount)}
        </p>
        <button
          className="icon-button text-slate-400 hover:text-red-600"
          onClick={onDelete}
          title="Eliminar"
          type="button"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

function StatusPill({ date }) {
  const days = daysUntil(date);
  let label = `En ${days} dias`;
  let className = "bg-blue-50 text-blue-700";

  if (days < 0) {
    label = `Atrasado ${Math.abs(days)} dias`;
    className = "bg-rose-50 text-rose-700";
  } else if (days === 0) {
    label = "Hoy";
    className = "bg-amber-50 text-amber-700";
  } else if (days <= 7) {
    className = "bg-amber-50 text-amber-700";
  }

  return <span className={`pill ${className}`}>{label}</span>;
}

function TextField({ label, onChange, placeholder, type = "text", value, ...props }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input
        className="field"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        value={value}
        {...props}
      />
    </label>
  );
}

function DateField({ label, onChange, value }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input
        className="field"
        onChange={(event) => onChange(event.target.value)}
        type="date"
        value={value}
      />
    </label>
  );
}

function CurrencyField({ label, onChange, value }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <div className="currency-input">
        <input
          inputMode="decimal"
          min="0"
          onChange={(event) => onChange(event.target.value)}
          step="0.01"
          type="number"
          value={value}
        />
        <span>EUR</span>
      </div>
    </label>
  );
}

function SelectField({ label, onChange, options, value }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <select className="field" onChange={(event) => onChange(event.target.value)} value={value}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function loadFinance() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? normalizeFinance(JSON.parse(stored)) : defaultFinance;
  } catch {
    return defaultFinance;
  }
}

function normalizeFinance(value) {
  return {
    ...defaultFinance,
    ...value,
    accounts: value?.accounts?.length ? value.accounts : defaultFinance.accounts,
    salaryPlan: { ...defaultFinance.salaryPlan, ...value?.salaryPlan },
    movements: value?.movements ?? [],
    fixedExpenses: value?.fixedExpenses ?? [],
    carExpenses: value?.carExpenses ?? [],
    businessEntries: value?.businessEntries ?? [],
    payrollEntries: value?.payrollEntries ?? [],
    debts: value?.debts ?? [],
  };
}

function createMovementForm(overrides = {}) {
  return {
    type: overrides.type ?? "expense",
    date: todayInput,
    amount: "",
    accountId: "bbva",
    toAccountId: "openbank",
    category: categoryOptions[overrides.type ?? "expense"][0],
    notes: "",
  };
}

function createFixedForm() {
  return {
    name: "",
    amount: "",
    frequency: "monthly",
    nextDate: todayInput,
    accountId: "bbva",
    category: "Suscripción",
    notes: "",
  };
}

function createCarForm() {
  return {
    date: todayInput,
    category: "Gasolina",
    amount: "",
    accountId: "bbva",
    notes: "",
  };
}

function createBusinessForm(overrides = {}) {
  return {
    date: todayInput,
    kind: overrides.kind ?? "income",
    concept: "",
    amount: "",
    accountId: "bbva",
    notes: "",
  };
}

function createDebtForm(overrides = {}) {
  return {
    direction: overrides.direction ?? "favor",
    person: "",
    amount: "",
    dueDate: todayInput,
    notes: "",
  };
}

function createPayrollForm(overrides = {}) {
  return {
    date: todayInput,
    salary: overrides.salary ?? "",
    savings: overrides.savings ?? 500,
    investment: overrides.investment ?? 250,
    accountId: overrides.accountId ?? "bbva",
    savingsAccountId: overrides.savingsAccountId ?? "openbank",
    notes: "",
  };
}

function createMovementFilters() {
  return {
    type: "all",
    category: "all",
    accountId: "all",
    dateFrom: "",
    dateTo: "",
    query: "",
  };
}

function createFixedFilters() {
  return {
    category: "all",
    frequency: "all",
    accountId: "all",
    dateFrom: "",
    dateTo: "",
    query: "",
  };
}

function createCarFilters() {
  return {
    category: "all",
    accountId: "all",
    dateFrom: "",
    dateTo: "",
    query: "",
  };
}

function createBusinessFilters() {
  return {
    kind: "all",
    accountId: "all",
    dateFrom: "",
    dateTo: "",
    query: "",
  };
}

function createDebtFilters() {
  return {
    direction: "all",
    status: "all",
    dateFrom: "",
    dateTo: "",
    query: "",
  };
}

function buildLedger(finance) {
  const carLedger = finance.carExpenses.map((expense) => ({
    id: `car-${expense.id}`,
    type: "expense",
    date: expense.date,
    accountId: expense.accountId,
    toAccountId: "",
    category: `Coche · ${expense.category}`,
    amount: expense.amount,
    notes: expense.notes,
  }));

  const businessLedger = finance.businessEntries.map((entry) => ({
    id: `business-${entry.id}`,
    type: entry.kind === "income" ? "income" : "expense",
    date: entry.date,
    accountId: entry.accountId,
    toAccountId: "",
    category: `Negocio · ${entry.concept}`,
    amount: entry.amount,
    notes: entry.notes,
  }));

  return [...finance.movements, ...carLedger, ...businessLedger];
}

function matchesMovementFilters(movement, filters) {
  const accountMatches =
    filters.accountId === "all" ||
    movement.accountId === filters.accountId ||
    movement.toAccountId === filters.accountId;

  return (
    (filters.type === "all" || movement.type === filters.type) &&
    (filters.category === "all" || movement.category === filters.category) &&
    accountMatches &&
    isWithinDateRange(movement.date, filters.dateFrom, filters.dateTo) &&
    matchesText(filters.query, [movement.category, movement.notes])
  );
}

function matchesFixedFilters(expense, filters) {
  return (
    (filters.category === "all" || expense.category === filters.category) &&
    (filters.frequency === "all" || expense.frequency === filters.frequency) &&
    (filters.accountId === "all" || expense.accountId === filters.accountId) &&
    isWithinDateRange(expense.nextDate, filters.dateFrom, filters.dateTo) &&
    matchesText(filters.query, [expense.name, expense.category, expense.notes])
  );
}

function matchesCarFilters(expense, filters) {
  return (
    (filters.category === "all" || expense.category === filters.category) &&
    (filters.accountId === "all" || expense.accountId === filters.accountId) &&
    isWithinDateRange(expense.date, filters.dateFrom, filters.dateTo) &&
    matchesText(filters.query, [expense.category, expense.notes])
  );
}

function matchesBusinessFilters(entry, filters) {
  return (
    (filters.kind === "all" || entry.kind === filters.kind) &&
    (filters.accountId === "all" || entry.accountId === filters.accountId) &&
    isWithinDateRange(entry.date, filters.dateFrom, filters.dateTo) &&
    matchesText(filters.query, [entry.concept, entry.notes])
  );
}

function matchesDebtFilters(debt, filters) {
  return (
    (filters.direction === "all" || debt.direction === filters.direction) &&
    (filters.status === "all" || debt.status === filters.status) &&
    (!debt.dueDate || isWithinDateRange(debt.dueDate, filters.dateFrom, filters.dateTo)) &&
    matchesText(filters.query, [debt.person, debt.notes])
  );
}

function isWithinDateRange(dateValue, dateFrom, dateTo) {
  if (!dateValue) return !dateFrom && !dateTo;
  const date = parseDate(dateValue);
  if (dateFrom && date < parseDate(dateFrom)) return false;
  if (dateTo && date > parseDate(dateTo)) return false;
  return true;
}

function matchesText(query, fields) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;
  return fields.some((field) => normalizeSearchText(field).includes(normalizedQuery));
}

function normalizeSearchText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function uniqueOptions(values) {
  return [...new Set(values.filter(Boolean))]
    .sort((first, second) => first.localeCompare(second, "es"))
    .map((value) => ({ value, label: value }));
}

function moneySummary(movements) {
  const income = movements
    .filter((movement) => movement.type === "income")
    .reduce((total, movement) => total + Number(movement.amount || 0), 0);
  const expense = movements
    .filter((movement) => movement.type === "expense")
    .reduce((total, movement) => total + Number(movement.amount || 0), 0);

  return {
    expense,
    income,
    net: income - expense,
  };
}

function applyMovementToAccounts(accounts, movement, multiplier) {
  return accounts.map((account) => {
    if (movement.type === "income" && account.id === movement.accountId) {
      return { ...account, balance: roundCurrency(account.balance + movement.amount * multiplier) };
    }

    if (movement.type === "expense" && account.id === movement.accountId) {
      return { ...account, balance: roundCurrency(account.balance - movement.amount * multiplier) };
    }

    if (movement.type === "transfer" && account.id === movement.accountId) {
      return { ...account, balance: roundCurrency(account.balance - movement.amount * multiplier) };
    }

    if (movement.type === "transfer" && account.id === movement.toAccountId) {
      return { ...account, balance: roundCurrency(account.balance + movement.amount * multiplier) };
    }

    return account;
  });
}

function sumByType(items, type) {
  return items
    .filter((item) => item.type === type)
    .reduce((total, item) => total + Number(item.amount || 0), 0);
}

function groupByAmount(items, key) {
  const grouped = items.reduce((accumulator, item) => {
    const name = item[key] || "Otros";
    accumulator[name] = (accumulator[name] || 0) + Number(item.amount || 0);
    return accumulator;
  }, {});

  return Object.entries(grouped)
    .map(([name, value]) => ({ name, value }))
    .sort((first, second) => second.value - first.value);
}

function monthlyEquivalent(expense) {
  if (expense.frequency === "monthly") return Number(expense.amount || 0);
  if (expense.frequency === "quarterly") return Number(expense.amount || 0) / 3;
  if (expense.frequency === "yearly") return Number(expense.amount || 0) / 12;
  return 0;
}

function advanceDate(dateValue, frequency) {
  if (frequency === "custom") return dateValue;
  const date = parseDate(dateValue);
  const months = frequency === "monthly" ? 1 : frequency === "quarterly" ? 3 : 12;
  date.setMonth(date.getMonth() + months);
  return toInputDate(date);
}

function getNextPayday(day) {
  const target = new Date(today.getFullYear(), today.getMonth(), clampDay(day));
  if (target < startOfToday()) {
    target.setMonth(target.getMonth() + 1);
  }
  return toInputDate(target);
}

function nextDateForDay(day, monthsStep) {
  const candidate = new Date(today.getFullYear(), today.getMonth(), clampDay(day));
  if (candidate < startOfToday()) {
    candidate.setMonth(candidate.getMonth() + monthsStep);
  }
  return toInputDate(candidate);
}

function nextMonthDate(day) {
  const date = new Date(today.getFullYear(), today.getMonth() + 1, clampDay(day));
  return toInputDate(date);
}

function moveDate(days) {
  const date = new Date(today);
  date.setDate(date.getDate() + days);
  return toInputDate(date);
}

function clampDay(day) {
  return Math.min(Math.max(Number(day) || 1, 1), 31);
}

function parseDate(dateValue) {
  return new Date(`${dateValue}T12:00:00`);
}

function startOfToday() {
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

function daysUntil(dateValue) {
  const diff = parseDate(dateValue) - startOfToday();
  return Math.round(diff / 86400000);
}

function isSameMonth(dateValue, reference) {
  const date = parseDate(dateValue);
  return date.getMonth() === reference.getMonth() && date.getFullYear() === reference.getFullYear();
}

function toInputDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(dateValue) {
  if (!dateValue) return "Sin fecha";
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
  }).format(parseDate(dateValue));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("es-ES", {
    currency: "EUR",
    style: "currency",
  }).format(Number(value || 0));
}

function parseAmount(value) {
  return Number(String(value ?? "").replace(",", ".")) || 0;
}

function roundCurrency(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default App;
