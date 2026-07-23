Melhoria futura:

1. criar um admin que somente ele possa alterar a role de usuários para agent ou admin
2. criar lógica que permita apenas agent ou admin atribuir um ticket a um assignee
3. ajustar tipagem de interfaces
   Controller params/query:
   string

Controller body:
string para campos textuais/enums vindos do cliente

Service request:
string enquanto ainda precisa validar

Service depois da validação:
TicketStatus / TicketPriority

Entity:
TicketStatus / TicketPriority

Repository:
TicketStatus / TicketPriority já validados
