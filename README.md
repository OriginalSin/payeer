# payeer

��������� ������� �� ������� �� ������� ��������!

��� ������� ������ �� lastAsk (��� ����� ����� ���� � ������� �������) � lastBid (����� ������� ���� � ������ �������).

�������������, ���� � ������� �������� ���� �����-�� ������� ������, �� ��� �������� ��������� ����������� ��������.

����� ���� �������� ���� ������� � ������� �� ������� ��� ������������ ���������� lastAsk, lastBid,
� ����� �� ������� �� ����������� �������� � �� ����.

������ �������� ������ ��-�� ������� ������ � �������� � ������ �� ���� ��������:

1) � ������ ������� �� ������ �� ������� ������ ������� � �������

2) ��������� ����� ������� (lastBid ������� �������)

����� ��������

� ��� ��� ������.

1. ����������� ������ ������� ������

�������� ������� �������� � ���������� ��������� ������� 
(�� ������� ��� ��������, ��� ������� ���������� ���������, �.�. ���������� ���������� ������ �� ������, ��� � ������ lastAsk)

balance = lastBalance * Bid / lastAsk,

��� Bid - ��� ������� ���� � ������ ������� �� ������ ���������� �������
(��������, � ������ ������� Bid = lastBid)

������ ������� ���� �������� ���, ����� ������ ��� ����������.

����� � ��� ���� ����������� ������� ��� ������ ������� � ��� ���� ������� lastAsk1, lastAsk2

���� ������� ������ ������, balance = lastBalance * Bid / lastAsk1

���� ������� ������ ������, balance = lastBalance * Bid / lastAsk2

��������, ������ ������� � ����� ������ � ������� ����� ������ �� ������ ��������, ���� lastAsk2 < lastAsk1

������� ������ ������������ nextBid � nextAsk (��������� �������� ������������ ��� �������, ��� ��� ���-��).

������� ������, ����

1) nextAsk > Ask
(�.�. ������� ���� ���� ������� - � ������ ������� �������� �������,
���� �� ����� �� ������, � �� ��������� ���� ��������� ��������, ����� ���� )

2) nextBid > Bid
(�.�. ��������� ���� ���� ������� - � ������� ������� ������� �������)

� ��������� ������ (�.�. ���� �� ��������� ���� ���� �������, ��� ���� �������, ��� �����) - ������� �� ������.

����� ����� ������� ���������� ����� StopLoss (��. ����).

2. ������ ������� ������ ����� ���������� ������� ������ (TakeProfit)

������������� ��� ���� ��������, ����� �� ��������� �������. ��������, 3%. 

���������� ����� �� ������� 100% ������ �� ���� LastBid * 1.03

���� ���� Bid � ������� ������, ����� ���� ����������. ��� ���������� ���� ���� ����� ������������� �����������.

3. ������ ������� ������ ����� ���������� ������ ������ (StopLoss)

������������� ��� ���� ��������, ����� �� ������������� ������. ��������, -2%. 

���������� ����� �� ������� 100% ������ �� ���� lastBid * 0.98

���� ���� Bid � ������� ������, ����� ���� ����������. ��� ���������� ���� ���� ����� ������������� �����������.

4. ����� ������ ������ ���������:

�������� ������ (���� ��� ��� �� �������) � ������ ������ (����� Bid � Ask ������ ������������)

����� ������� ����� ���������� StopLoss.

����������� ��������� ���� Bid � ������ �������.

���� Bid ����� � ���������� StopLoss, �������� ��� � ������ TakeProfit.

���� Bid ����� � �� ���������� StopLoss, ���������� ������� TakeProfit (���� ��� ���, ������������� ���).

���� Bid ���� � Bid > lastBid * 0.99, ������ �� ������ (�.�. ������ ����� TakeProfit)

���� Bid ���� � lastBid * 0.98 < Bid < lastBid * 0.99, ������������� StopLoss

���� Bid ���� � Bid < lastBid * 0.98, ������������� StopLoss �� ������� ���� Bid (�.�. ���������� ������� ������)

.............................

23.01.2021 ����������� ������� ������ �� �����

�� ����� � ������ ������ ������� �������� 100 ��������� ������ (�����+����+���������+�����+���), ������������� �� �������� �������:
0: "14:17+32900.00+0.00303951+100+buy"
1: "14:16+32800.00+0.00083045+27.24+buy"
2: "14:16+32800.00+0.00304878+100+buy"
3: "14:15+32800.00+0.00304878+100+buy"
4: "14:15+32799.99+0.000164+5.37+sell"
5: "14:15+32800.00+0.00018262+5.99+buy"
6: "14:14+32800.00+0.00015197+4.98+buy"
7: "14:13+32799.99+0.00015556+5.1+sell"
8: "14:13+32800.00+0.00084146+27.6+sell"
9: "14:13+32800.00+0.00027439+9+sell"
10: "14:13+32800.00+0.00192709+63.21+sell"
11: "14:12+32900.00+0.00023647+7.78+buy"
12: "14:11+32800.00+0.00063388+20.79+buy"
13: "14:11+32799.99+0.00042909+14.08+buy"
14: "14:09+32799.99+0.00015018+4.92+buy"
15: "14:09+32800.00+0.0001067+3.5+buy"
...
89: "13:29+32900.00+0.000142+4.67+sell"
90: "13:28+32900.00+0.001+32.9+sell"
91: "13:26+32990.00+0.00054379+17.94+buy"
92: "13:25+32899.00+0.00032625+10.73+sell"
93: "13:25+32899.00+0.00063036+20.73+sell"
94: "13:25+32899.00+0.0002+6.57+sell"
95: "13:23+32999.99+0.0001+3.29+buy"
96: "14:17+32800.00+0.00188761+61.91+sell"
97: "14:17+32777.00+0.00915275+300+sell"
98: "14:17+32778.00+0.12913506+4232.79+sell"
99: "14:17+32779.01+0.0038128+124.98+sell"

��������� ��������� ��� ��� ������, �� �������� ����� ���������� ������ 100 ��������� ������.
������: ��������� ������� ������, �.�. "�����" ������������ ������ � ���� ������ ������ (�������� ����� �������� ������).
��� ����� ����� ������������� ������ ���� ���������� � ������� �������.
������ ��� ����, ��� � ������ �� ��������� ���������� ����� (����� ���������������� ������ ��������� � ����� ����������� �����).
� ������ ������ ������ ��������� ���������� ���������� ������ ������ ���������� �����.

� ����� ������ ������������ ������� �� ������������ ������� ���������� �� ���������.

������ 1:
����� ������� �������, ������, �� 200 ���������� ��������. ����� ������ ����� �������� ������ ���������� ��������.
� ���� ������ ���������, ����� ����� �������� ������������� ������ �����.

������ 2:
���� ������������ ������ ������������ �� ��� �����, �������� "�������" � ������� - ����� �������� ������������� ������ �� ������������ � ��������.

������� ������������, ��� ������ ���������� �� ������� ����� (�� ��������� � �������� ������).
�� ���� ��������� ���������� ������ � ������� ����� ���������� ���������� ����� (�������� ������� � ���������� ���������� �������).

������.slice(0,100].join()==�������.slice(0,100).join() => ����� ������� ����� ������
���
������.slice(1,100).join()==�������.slice(0,99).join() => ����� ������� ����� ������.slice(0,1)+�������
���
������.slice(2,100].join()==�������.slice(0,98).join() => ����� ������� ����� ������.slice(0,2)+�������
���
..
������.slice(99,100).join()==�������.slice(0,1).join() => ����� ������� ����� ������.slice(0,99)+�������
��� ����� ������� ����� ������.slice(0,100)+�������

