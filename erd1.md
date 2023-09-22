+------------+
|  insight   |
+------------+
| id (PK)    |
| username   |
| title      |
| content    |
+------------+

+--------------+
|  expertise   |
+--------------+
| expertiseCode|1
|    (PK)     |||
+--------------+ |
| name         | |
+--------------+ |
                 |
+------------+   |
|    user    |   |
+------------+   |
| userCode   |||
|   (PK)     ||| 
+------------+||
| firstName  |||
| lastName   |||
| email      |||
| username   |||
| phone      |||
| education  |||
| userType   |||
| password   |||
| profExp    |||
| expertiseCo|1|
| approved   |||
+------------+

+-------------+
| negotiation |
+-------------+
|  negoid (PK)|         
+-------------+
| userCode1   |0:&
+-------------+---
| userCode2   |0:&
+-------------+   |
| mediatorCode|0:&
+-------------+   |
| topicCode   |   |
| title       |   |
| startTime   |   |
| endTime     |   |
| description |   |
| summary     |   |
+-------------+   |
                   |
+------------+     |
|  message   |     |
+------------+     |
|messageCode |     |
|   (PK)     |     |
+------------+     |
| content    |     |
| userCode   |0:&  |
| time       |     |
|  negoid    |0:&  |
+------------+     |
                   |
+--------------+   |
| notifications|   |
+--------------+   |
|    id (PK)  |||  |
+--------------+||  |
|   UserCode   |||  |
|   content    |||  |
|   isSeen     |||  |
+--------------+||  |
