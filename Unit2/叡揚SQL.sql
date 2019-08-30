--1.�ЦC�X�C�ӭɾ\�H�C�~�ɮѼƶq�A�ḙ̀ɾ\�H�s���M�~�װ��Ƨ�
SELECT  
 mm.USER_ID AS [KeeperId],
 mm.USER_CNAME AS [CName],
 mm.USER_ENAME AS [EName],
 YEAR(blr.LEND_DATE)AS [BorrowYear],
 COUNT(YEAR(blr.LEND_DATE)) AS [BorrowCnt]  --�qLEND_DATE�̭p��Ӧ~�̭ɮѦ���
FROM BOOK_LEND_RECORD blr,MEMBER_M mm
WHERE blr.KEEPER_ID = [mm.USER_ID]
GROUP BY mm.USER_ID,mm.USER_CNAME,mm.USER_ENAME,YEAR(blr.LEND_DATE) --YEAR()�n�g�i�h���M�|��P�O�Ӧ~�o���P����}��
ORDER BY mm.USER_ID,[Borrow Year];

--2.�C�X�̨��w�諸�ѫe���W(�ɾ\�ƶq�̦h�e���W)
SELECT TOP (5) --WITH TIES �P���]�|�C�i�h
 bd.BOOK_ID AS [BookId], --���e�X�O����n�A�Ƨǳ̫�~�︹�J�y
 bd.BOOK_NAME AS [BookName],
 COUNT(blr.CRE_DATE) AS [QTY]
FROM BOOK_LEND_RECORD blr,BOOK_DATA bd
WHERE bd.BOOK_ID=blr.BOOK_ID
GROUP BY bd.BOOK_ID,bd.BOOK_NAME
ORDER BY QTY DESC;

--3.�H�@�u�C�X2019�~�C�@�u���y�ɾ\�Ѷq
SELECT 
CASE DATEPART(QUARTER,blr.LEND_DATE) --datepart�Hquarter���|��
	WHEN 1 THEN '2019/01~2019/03' --join Span_Table
	WHEN 2 THEN '2019/04~2019/06'
	WHEN 3 THEN '2019/07~2019/09'
	WHEN 4 THEN '2019/10~2019/12'
	END AS [Quarter],
	COUNT(blr.CRE_DATE) AS [Cnt]
FROM BOOK_LEND_RECORD blr
WHERE YEAR(blr.LEND_DATE)=2019 --��~��2019
GROUP BY DATEPART(QUARTER,blr.LEND_DATE);

SELECT * FROM SPAN_TABLE st;
--4.���X�C�Ӥ����ɾ\�ƶq�e�T�W�ѥ��μƶq
SELECT *
FROM        --rank()
	(SELECT ROW_NUMBER() OVER(PARTITION BY bc.BOOK_CLASS_NAME ORDER BY COUNT(blr.LEND_DATE)DESC) AS [Seq], --rownum�����y���s�� �A�Hbook class name���� �Hlend date��
	bc.BOOK_CLASS_NAME AS [BookClass],
	bd.BOOK_ID AS [BookId],
	bd.BOOK_NAME AS [BookName],
	COUNT(blr.LEND_DATE) AS [Cnt]
	FROM BOOK_LEND_RECORD blr,BOOK_CLASS bc,BOOK_DATA bd
	WHERE bc.BOOK_CLASS_ID=bd.BOOK_CLASS_ID
	AND bd.BOOK_ID=blr.BOOK_ID
	GROUP BY bc.BOOK_CLASS_NAME,bd.BOOK_ID,bd.BOOK_NAME) AS [Data]
WHERE Data.Seq<=3;

--5.�ЦC�X 2016, 2017, 2018, 2019 �U���y���O���ɾ\�ƶq���
SELECT T.classId AS [ClassId],T.classname AS [ClassName], --��case when�����
	   COUNT(CASE WHEN t.CntYear='2016' THEN 1 ELSE NULL END) AS [CNT2016],
	   COUNT(CASE WHEN t.CntYear='2017' THEN 1 ELSE NULL END) AS [CNT2017],
	   COUNT(CASE WHEN t.CntYear='2018' THEN 1 ELSE NULL END) AS [CNT2018],
	   COUNT(CASE WHEN t.CntYear='2019' THEN 1 ELSE NULL END) AS [CNT2019]
FROM
	(SELECT bc.BOOK_CLASS_ID AS [classId],bc.BOOK_CLASS_NAME AS [classname],
		YEAR(blr.CRE_DATE) AS [CntYear],COUNT(blr.BOOK_ID) AS [CNT]
	 FROM BOOK_LEND_RECORD blr
		INNER JOIN BOOK_DATA bd ON bd.BOOK_ID = blr.BOOK_ID
		INNER JOIN BOOK_CLASS bc ON bc.BOOK_CLASS_ID = bd.BOOK_CLASS_ID
		GROUP BY bc.BOOK_CLASS_ID,bc.BOOK_CLASS_NAME,blr.CRE_DATE) AS t
GROUP BY t.classId,t.classname
ORDER BY ClassId;

--6.�Шϥ� PIVOT �y�k�C�X2016, 2017, 2018, 2019 �U���y���O���ɾ\�ƶq���
SELECT p.ClassId AS [ClassId],p.Classname AS [ClassName],[p].[2016] AS [CNT2016],
	  [p].[2017] AS [CNT2017], p.[2018] AS [CNT2018],p.[2019] AS [CNT2019]
FROM
	(SELECT bc.BOOK_CLASS_ID AS [classId],bc.BOOK_CLASS_NAME AS [classname],
	    YEAR(blr.CRE_DATE) AS [CntYear],blr.LEND_DATE AS [CNT]
	FROM BOOK_LEND_RECORD blr
		INNER JOIN BOOK_DATA bd ON bd.BOOK_ID = blr.BOOK_ID 
		INNER JOIN BOOK_CLASS bc ON bc.BOOK_CLASS_ID = bd.BOOK_CLASS_ID
GROUP BY bc.BOOK_CLASS_ID,bc.BOOK_CLASS_NAME,blr.CRE_DATE,blr.LEND_DATE)t
PIVOT(COUNT(t.CNT) FOR t.CntYear IN ([2016],[2017],[2018],[2019]))p
ORDER BY ClassId;

--7.�Ьd�ߥX���|���ɮѬ���
SELECT bd.BOOK_ID AS [�ѥ�ID],
	   CONVERT(VARCHAR,bd.BOOK_BOUGHT_DATE,111) AS [�ʮѤ��], --�O�o�ŧi���� ����q�`�O10 --char�|�O�s�ŭȥe�Ŷ�
	   CONVERT(VARCHAR,blr.LEND_DATE,111) AS [�ɾ\���],
	   bc.BOOK_CLASS_ID + '-' + bc.BOOK_CLASS_NAME AS [���y���O],
	   mm.USER_ID + '-' + mm.USER_CNAME + '(' + mm.USER_ENAME + ')' AS [�ɾ\�H],
	   bd.BOOK_STATUS + '-' + bc1.CODE_NAME AS [���A],
	   PARSENAME(CONVERT(VARCHAR,CONVERT(MONEY,bd.BOOK_AMOUNT),1),2) + '��'  AS [�ʮѪ��B] --convert���⦨varchar
FROM BOOK_DATA bd
	 INNER JOIN BOOK_LEND_RECORD blr ON blr.BOOK_ID=bd.BOOK_ID --��D�ntable
	 INNER JOIN BOOK_CLASS bc ON bc.BOOK_CLASS_ID=bd.BOOK_CLASS_ID 
	 INNER JOIN BOOK_CODE bc1 ON bc1.CODE_ID=bd.BOOK_STATUS
	 INNER JOIN MEMBER_M mm ON mm.[USER_ID]=blr.KEEPER_ID
WHERE mm.[USER_ID]='0002'
ORDER BY bd.BOOK_AMOUNT DESC;

--8.�s�W�@���ɾ\�����A�ɮѤH�����|�A�ѥ�ID��2004�A�íק�ɾ\�����2019/01/02
SET IDENTITY_INSERT BOOK_LEND_RECORD ON --����Ʈw�n��transation
INSERT INTO BOOK_LEND_RECORD(IDENTITY_FILED,BOOK_ID,KEEPER_ID,LEND_DATE,CRE_DATE,CRE_USR,MOD_DATE,MOD_USR)
VALUES (1162,2004,'0002','2019-01-02 00:00:00.000','2019-01-02 00:00:00.000','0002','2019-01-02 00:00:00.000','0002'); --�p�G��즳�}identity(1,1) �i����key Identity_Filed --Identity�q�`�O�ߤ@��

--9.�бN�D9�s�W���ɾ\����(�ѥ�ID=2004)�R��
DELETE FROM BOOK_LEND_RECORD WHERE IDENTITY_FILED=1162; --�M�I������q��b�@�_������