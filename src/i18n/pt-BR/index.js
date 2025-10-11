// src/i18n/pt-BR.js

// import DashboardPage from "src/pages/DashboardPage.vue";

export default {
  // Uma estrutura de namespaces ajuda a organizar. 'login' é o namespace aqui.
  login: {
    welcome_to: 'Bem Vindo à',
    app_name: 'Locadora de Livros',
    make_your_login: 'Faça aqui o seu Login',
    happy_to_see_you_again: 'feliz em vê-lo novamente!',
    // Campos do formulário e botões
    email_label: 'Email',
    password_label: 'Senha',
    enter_button: 'Entrar',
    // Mensagens de notificação e erro
    success_message: 'Login bem-sucedido!',
    error_message_default: 'Email ou senha inválidos. Tente novamente.',
  },

  DashboardPage: {
    Rental_Distribution: 'Distribuição de Aluguéis',
    Most_Rented_Books: 'Livros Mais Alugados',
    Total_Rentals: 'Total de Aluguéis',
    Total_Renters: 'Total de Locatários',
    Renter: 'Locatário',
    Total_Loans: 'Total de Empréstimos',
    Rentals_Returned: 'Aluguéis Devolvidos',
    Returned: 'Devolvidos',
    Pending: 'Pendentes',
    Rentals: 'Aluguéis',
  },
  RentersPage: {
    title: 'Locatários',
    search_placeholder: 'Pesquisar locatário',
    register_button: 'Cadastrar',
    update_button: 'Atualizar',
    cancel_button: 'Cancelar',
    close_button: 'Fechar',
    delete_button: 'Excluir',
    back_button: 'Voltar',
    actions_header: 'Ações',

    column_name: 'Nome',
    column_email: 'E-mail',
    column_phone: 'Telefone',
    column_cpf: 'CPF',
    column_address: 'Endereço',

    modal_register_title: 'Cadastrar Locatário',
    modal_update_title: 'Atualizar Locatário',

    input_name_label: 'Nome do Locatário',
    input_email_label: 'Email',
    input_phone_label: 'Telefone',
    input_cpf_label: 'CPF',
    input_address_label: 'Endereço',

    // Mensagens e Validação
    validation_required: 'Campo obrigatório',
    validation_fill_all: 'Preencha todos os campos obrigatórios para cadastrar.',
    confirm_delete_q1: 'Certeza que deseja excluir esse locatário?',
    confirm_delete_q2: 'Após essa ação não haverá retorno.',

    success_register: 'Locatário cadastrado com sucesso!',
    success_update: 'Locatário atualizado com sucesso!',
    success_delete: 'Locatário excluído com sucesso!',

    error_load_default: 'Erro ao carregar a lista de locatários. Verifique a API.',
    error_unknown: 'Erro desconhecido ao cadastrar.',
    error_validation: 'Erro de validação nos dados. Verifique todos os campos.',
    error_connection: 'Erro na conexão ou no servidor.',
    error_update_default: 'Erro ao atualizar locatário.',
    error_delete_default: 'Erro ao excluir locatário.',
    error_delete_linked: 'Não foi possível deletar. Ele pode estar vinculado a um aluguel ativo.',
    error_delete_permission: 'Acesso negado. Você não tem permissão para excluir.',
  },
  PublishersPage: {
    title: 'Editoras',
    register_button: 'Cadastrar',
    update_button: 'Atualizar',
    delete_button: 'Excluir',
    cancel_button: 'Cancelar',
    close_button: 'Fechar',
    back_button: 'Voltar',
    search_placeholder: 'Pesquisar Editoras',
    actions_header: 'Ações',

    // Colunas da Tabela
    column_name: 'Nome',
    column_email: 'E-mail',
    column_phone: 'Telefone',
    column_website: 'Site',

    // Modais e Inputs
    modal_register_title: 'Cadastrar Editora',
    modal_update_title: 'Atualizar Editora',
    input_name_label: 'Nome da Editora',
    input_email_label: 'Email da Editora',
    input_phone_label: 'Telefone',
    input_website_label: 'Site da Editora',

    // Confirmação de Exclusão
    confirm_delete_q1: 'Certeza que deseja excluir essa Editora?',
    confirm_delete_q2: 'Após essa ação não haverá retorno.',

    // Notificações (Sucesso)
    success_register: 'Editora cadastrada com sucesso!',
    success_update: 'Editora atualizada com sucesso!',
    success_delete: 'Editora excluída com sucesso!',

    // Notificações (Validação/Erro)
    validation_required: 'Campo obrigatório',
    validation_fill_all: 'Preencha todos os campos obrigatórios.',
    error_load_default: 'Erro ao carregar lista de editoras.',
    error_connection: 'Verifique sua conexão ou token de acesso.',
    error_register_default: 'Falha ao cadastrar editora. Tente novamente.',
    error_update_default: 'Falha ao atualizar editora.',
    error_delete_default: 'Falha ao excluir editora.',
    error_delete_linked: 'Esta editora não pode ser excluída, pois está vinculada a um ou mais livros.',
  },

  BooksPage: {
    title: 'Livros',
    register_button: 'Cadastrar',
    update_button: 'Atualizar',
    delete_button: 'Excluir',
    cancel_button: 'Cancelar',
    back_button: 'Voltar',
    search_placeholder: 'Pesquisar Livro',
    actions_header: 'Ações',
    not_applicable: 'N/A',
    loading_books: 'Carregando livros...',

    // Colunas da Tabela
    column_title: 'Título',
    column_author: 'Autor',
    column_launch_date: 'Lançamento',
    column_total: 'Total',
    column_in_use: 'Em Uso',
    column_publisher: 'Editora',

    // Modais e Inputs
    modal_register_title: 'Cadastrar Livro',
    modal_update_title: 'Atualizar Livro',
    input_title_label: 'Título do Livro',
    input_author_label: 'Autor',
    input_launch_date_label: 'Data de Lançamento',
    input_total_quantity_label: 'Quantidade Total',
    input_publisher_label: 'Editora',

    // Confirmação de Exclusão
    confirm_delete_q1: 'Certeza que deseja excluir esse Livro?',
    confirm_delete_q2: 'Após essa ação não haverá retorno.',

    // Notificações (Sucesso)
    success_register: 'Livro cadastrado com sucesso!',
    success_update: 'Livro atualizado com sucesso!',
    success_delete: 'Livro deletado com sucesso!',

    // Notificações (Validação/Erro)
    validation_fill_all: 'Preencha todos os campos obrigatórios para salvar.',
    error_load_default: 'Erro ao carregar lista de livros.',
    error_connection: 'Erro ao carregar dados da API. Verifique o servidor/rede.',
    error_save_default: 'Erro ao salvar o livro.',
    error_delete_default: 'Erro ao deletar o livro.',
    error_delete_linked: 'Não foi possível deletar o livro. Ele está vinculado a um ou mais aluguéis ativos.',
  },
  RentalsPage: {
    title: 'Aluguéis',
    register_button: 'Cadastrar',
    update_button: 'Atualizar',
    delete_button: 'Excluir', // Mantido para consistência, apesar de não ser usado
    cancel_button: 'Cancelar',
    confirm_button: 'Confirmar',
    back_button: 'Voltar',
    search_placeholder: 'Pesquisar Aluguel',
    actions_header: 'Ações',
    not_applicable_short: '-',
    loading_rentals: 'Carregando aluguéis...',

    // Status do Aluguel
    status_rented: 'Alugado',
    status_in_time: 'No Prazo',
    status_late: 'Atrasado',
    status_delivered_on_time: 'Devolvido no Prazo',
    status_delivered_with_delay: 'Devolvido com Atraso',

    // Colunas da Tabela
    column_renter: 'Locatário',
    column_book: 'Livro',
    column_rent_date: 'Alugado',
    column_deadline: 'Prazo',
    column_devolution_date: 'Devolução',
    column_status: 'Status',

    // Tooltips
    tooltip_receive: 'Marcar como Recebido',
    tooltip_edit: 'Editar Prazo de Devolução',

    // Modais e Inputs
    modal_register_title: 'Cadastrar Aluguel',
    modal_update_title: 'Atualizar Aluguel',
    input_renter_label: 'Locatário',
    input_book_label: 'Livro',
    input_rent_date_label: 'Data de Aluguel',
    input_deadline_label: 'Prazo de Devolução',
    available_caption: 'Disponível',

    // Confirmação de Recebimento
    confirm_receive_title: 'Confirmar Recebimento',
    confirm_receive_q1: 'Deseja marcar o livro',
    confirm_receive_q2: 'como recebido? A data de hoje será registrada como devolução.',

    // Notificações (Sucesso)
    success_register: 'Aluguel cadastrado com sucesso!',
    success_update: 'Aluguel atualizado com sucesso!',
    success_receive: 'Livro recebido com sucesso! Status atualizado.',

    // Notificações (Validação/Erro)
    validation_fill_all: 'Preencha todos os campos obrigatórios para salvar.',
    error_load_default: 'Erro ao carregar dados. Verifique sua conexão e permissões.',
    error_save_default: 'Erro ao salvar o aluguel.',
    error_receive_default: 'Erro ao registrar recebimento. Verifique o servidor.',
  },
  UsersPage: {
    title: 'Usuários',
    register_button: 'Cadastrar',
    update_button: 'Atualizar',
    delete_button: 'Excluir',
    cancel_button: 'Cancelar',
    close_button: 'Fechar',
    back_button: 'Voltar',
    search_placeholder: 'Pesquisar Usuário',
    actions_header: 'Ações',
    loading_users: 'Carregando usuários...',

    // Tipos de Usuário (Roles)
    role_user: 'Usuário',
    role_admin: 'Administrador',

    // Colunas da Tabela
    column_name: 'Nome',
    column_email: 'E-mail',
    column_role: 'Permissão',

    // Tooltips
    tooltip_edit: 'Editar Usuário',
    tooltip_delete: 'Excluir Usuário',

    // Modais e Inputs
    modal_register_title: 'Cadastrar Usuário',
    modal_update_title: 'Atualizar Usuário',
    input_name_label: 'Nome do Usuário',
    input_email_label: 'Email',
    input_password_label: 'Senha',
    input_new_password_label: 'Nova Senha (Opcional)',
    input_confirm_password_label: 'Confirmar Nova Senha',
    input_role_label: 'Tipo de Usuário',

    // Confirmação de Exclusão
    confirm_delete_q1: 'Certeza que deseja excluir esse Usuário?',
    confirm_delete_q2: 'Após essa ação não haverá retorno.',

    // Notificações (Sucesso)
    success_register: 'Usuário cadastrado com sucesso!',
    success_update: 'Usuário atualizado com sucesso!',
    success_delete: 'Usuário deletado com sucesso!',

    // Notificações (Validação/Erro)
    validation_fill_all: 'Preencha todos os campos obrigatórios.',
    validation_password_mismatch: 'As novas senhas não conferem!',
    validation_name_email_required: 'Nome e email são obrigatórios.',
    error_load_default: 'Falha ao carregar usuários.',
    error_network: 'Erro de rede.',
    error_check_console: 'Verifique o console.',
    error_register_default: 'Erro ao cadastrar usuário.',
    error_update_default: 'Erro ao atualizar usuário.',
    error_delete_default: 'Erro ao deletar usuário.',
  },
  MainLayout: {
    app_title: 'Locadora de Livros',
    menu_aria_label: 'Menu Principal',
    logout_button: 'Sair',
    language_selector: 'Idioma',

    // Menu Dropdown do Usuário
    user_short_label: 'Eu',
    user_full_label: 'Usuário',
    user_info_title: 'Informações:',
    user_name_label: 'Usuário',
    user_email_label: 'Email',
    user_permission_label: 'Permissão',

    // Links do Menu Lateral
    link_dashboard: 'Dashboard',
    link_renters: 'Locatário',
    link_publishers: 'Editoras',
    link_books: 'Livros',
    link_rentals: 'Aluguéis',
    link_users: 'Usuários',
  },
  // Aqui você pode adicionar outros namespaces, como 'dashboard', 'settings', etc.
  general: {
    data_load_error: 'Falha ao carregar dados da Dashboard.',
    language_updated: 'Idioma atualizado.',
  }
}