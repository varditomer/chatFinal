                     +-------------+
                     |  expertise  |
                     +-------------+
                     | expertiseCod|1
                     |    (PK)     |
                     +-------------+
                          ^
                          |
                          |
         0:&               |1              0:&
+-------------+     +------------+     +-------------+
|  message    |<----|    user    |<----| negotiation |
+-------------+     +------------+     +-------------+
|messageCode  |     | userCode   |     |  negoid (PK)| 
|   (PK)     |     |   (PK)     |     +-------------+
+-------------+     +------------+     | userCode1   |0:&
| content     |                       +-------------+
| userCode    |                       | userCode2   |
| time        |                       +-------------+
|  negoid     |                       | mediatorCode|
+-------------+                       +-------------+

         0:&               ^
+--------------+           |
| notifications|           |
+--------------+           |
|    id (PK)   |           |
+--------------+           |
|   UserCode   |           |
|   content    |           |
|   isSeen     |           |
+--------------+           |

          +------------+
          |  insight   |
          +------------+
          | id (PK)    |
          | username   |
          | title      |
          | content    |
          +------------+
