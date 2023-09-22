           0:&           0:&         0:&
       +----------+ +----------+ +----------+
       | userCode1| | userCode2| |mediatorCod|
       |    (FK)  | |   (FK)   | |   (FK)   |
       +----------+ +----------+ +----------+
            ^         ^            ^
            |         |            |
            |         |            |
       (Negotiator) (Negotiator) (Mediator)
            |         |            |
            |         |            |
         +-------------------------------+
         |          negotiation         |
         +-------------------------------+
         |  negoid (PK)                 |
         |  userCode1 (FK to user)      |
         |  userCode2 (FK to user)      |
         |  mediatorCode (FK to user)   |
         |  topicCode                   |
         |  title                       |
         |  startTime                   |
         |  endTime                     |
         |  description                 |
         |  summary                     |
         +-------------------------------+
