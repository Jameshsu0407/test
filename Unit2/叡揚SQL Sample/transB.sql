USE TSQL2012;
GO

SELECT * FROM Sales.Orders(NOLOCK) WHERE OrderID = 11051

SELECT * FROM Sales.Orders WHERE OrderID >= 11050 AND OrderID <= 11060