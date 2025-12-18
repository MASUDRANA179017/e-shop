import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  CircularProgress
} from "@mui/material";
import { FaWallet, FaPlus } from "react-icons/fa";
import { getWalletBalance, getWalletTransactions, depositFunds } from "../../../@Services/WalletService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserWallet = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDeposit, setOpenDeposit] = useState(false);
  const [amount, setAmount] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const balanceRes = await getWalletBalance();
      setBalance(balanceRes.balance);
      const transactionsRes = await getWalletTransactions();
      setTransactions(transactionsRes);
    } catch (error) {
      console.error("Failed to fetch wallet data", error);
      toast.error("Failed to load wallet data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeposit = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      await depositFunds({ amount: parseFloat(amount), description: "Manual Deposit" });
      toast.success("Deposit successful");
      setOpenDeposit(false);
      setAmount("");
      fetchData();
    } catch (error) {
      console.error("Deposit failed", error);
      toast.error("Deposit failed");
    }
  };

  return (
    <Box>
        <ToastContainer />
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FaWallet /> My Wallet
        </Typography>
        <Button
          variant="contained"
          startIcon={<FaPlus />}
          onClick={() => setOpenDeposit(true)}
          color="primary"
        >
          Add Funds
        </Button>
      </Box>

      {/* Balance Card */}
      <Paper sx={{ p: 3, mb: 4, bgcolor: "primary.main", color: "white", borderRadius: 2 }}>
        <Typography variant="subtitle1">Current Balance</Typography>
        <Typography variant="h3" fontWeight="bold">
          ${Number(balance).toFixed(2)}
        </Typography>
      </Paper>

      <Typography variant="h6" sx={{ mb: 2 }}>Transaction History</Typography>
      
      <TableContainer component={Paper}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">No transactions found</TableCell>
                </TableRow>
              ) : (
                transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>#{tx.id}</TableCell>
                    <TableCell>{new Date(tx.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip 
                        label={tx.type.toUpperCase()} 
                        color={tx.type === 'deposit' ? 'success' : 'error'} 
                        size="small" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{tx.description}</TableCell>
                    <TableCell align="right" sx={{ 
                      fontWeight: 'bold', 
                      color: tx.type === 'deposit' ? 'green' : 'red' 
                    }}>
                      {tx.type === 'deposit' ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Deposit Dialog */}
      <Dialog open={openDeposit} onClose={() => setOpenDeposit(false)}>
        <DialogTitle>Add Funds</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Enter amount to deposit into your wallet.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Amount ($)"
            type="number"
            fullWidth
            variant="outlined"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeposit(false)}>Cancel</Button>
          <Button onClick={handleDeposit} variant="contained" color="primary">
            Deposit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserWallet;
