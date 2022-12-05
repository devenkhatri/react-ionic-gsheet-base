
export const refreshPage = () => {
    window.location.reload();
}

export const formatCurrency = (amount: any) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, }).format(amount)
}