import BalanceCard from "../components/BalanceCard";
import AccountsCard from "../components/AccountsCard";
import MonthCard from "../components/MonthCard";
import BottomNav from "../components/BottomNav";
import FloatingButton from "../components/FloatingButton";

export default function Dashboard() {
  return (
    <>
      <div className="container">
        <h1>💰 Finanzas</h1>

        <BalanceCard />
        <AccountsCard />
        <MonthCard />
      </div>

      <FloatingButton />
      <BottomNav />
    </>
  );
}