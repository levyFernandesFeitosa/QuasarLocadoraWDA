export default {
  login: {
    welcome_to: 'Bienvenue à la',
    app_name: 'Boutique de Location de Livres',
    make_your_login: 'Connectez-vous ici',
    happy_to_see_you_again: 'Heureux de vous revoir!',
    // Form fields and buttons
    email_label: 'E-mail',
    password_label: 'Mot de Passe',
    enter_button: 'Entrer',
    // Notification and error messages
    success_message: 'Connexion réussie!',
    error_message_default: 'E-mail ou mot de passe invalide. Veuillez réessayer.',
  },

  DashboardPage: {
    Rental_Distribution: 'Distribution des Locations',
    Most_Rented_Books: 'Livres les Plus Loués',
    Total_Rentals: 'Locations Totales',
    Total_Renters: 'Total des Locataires',
    Renter: 'Locataire',
    Total_Loans: 'Prêts Totaux',
    Rentals_Returned: 'Locations Rendués',
    Returned: 'Rendués',
    Pending: 'En Attente',
    Rentals: 'Locations',
  },
  RentersPage: {
    title: 'Locataires',
    search_placeholder: 'Rechercher locataire',
    register_button: 'Enreg.',
    update_button: 'Mettre à jour',
    cancel_button: 'Annuler',
    close_button: 'Fermer',
    delete_button: 'Supprimer',
    back_button: 'Retourner',
    actions_header: 'Actions',

    column_name: 'Nom',
    column_email: 'E-mail',
    column_phone: 'Téléphone',
    column_cpf: 'CPF',
    column_address: 'Adresse',

    modal_register_title: 'Enregistrer un Locataire',
    modal_update_title: 'Mettre à Jour un Locataire',

    input_name_label: 'Nom du Locataire',
    input_email_label: 'E-mail',
    input_phone_label: 'Téléphone',
    input_cpf_label: 'CPF',
    input_address_label: 'Adresse',

    // Messages and Validation
    validation_required: 'Champ obligatoire',
    validation_fill_all: 'Remplissez tous les champs obligatoires pour vous inscrire.',
    confirm_delete_q1: 'Êtes-vous sûr de vouloir supprimer ce locataire?',
    confirm_delete_q2: 'Cette action est irréversible.',

    success_register: 'Locataire enregistré avec succès !',
    success_update: 'Locataire mis à jour avec succès !',
    success_delete: 'Locataire supprimé avec succès !',

    error_load_default: 'Erreur lors du chargement de la liste des locataires. Vérifiez l\'API.',
    error_unknown: 'Erreur inconnue lors de l\'enregistrement.',
    error_validation: 'Erreur de validation des données. Vérifiez tous les champs.',
    error_connection: 'Erreur de connexion ou de serveur.',
    error_update_default: 'Erreur lors de la mise à jour du locataire.',
    error_delete_default: 'Erreur lors de la suppression du locataire.',
    error_delete_linked: 'Impossible de supprimer. Il pourrait être lié à une location active.',
    error_delete_permission: 'Accès refusé. Vous n\'avez pas la permission de supprimer.',
  },
  PublishersPage: {
    title: 'Éditeurs',
    register_button: 'Enreg.',
    update_button: 'Mettre à jour',
    delete_button: 'Supprimer',
    cancel_button: 'Annuler',
    close_button: 'Fermer',
    back_button: 'Retourner',
    search_placeholder: 'Rechercher des éditeurs',
    actions_header: 'Actions',

    // Colonnes du Tableau
    column_name: 'Nom',
    column_email: 'E-mail',
    column_phone: 'Téléphone',
    column_website: 'Site Web',

    // Modales et Champs de Saisie
    modal_register_title: 'Enregistrer un éditeur',
    modal_update_title: 'Mettre à jour l\'éditeur',
    input_name_label: 'Nom de l\'éditeur',
    input_email_label: 'E-mail de l\'éditeur',
    input_phone_label: 'Téléphone',
    input_website_label: 'Site Web de l\'éditeur',

    // Confirmation de Suppression
    confirm_delete_q1: 'Êtes-vous sûr de vouloir supprimer cet éditeur?',
    confirm_delete_q2: 'Cette action est irréversible.',

    // Notifications (Succès)
    success_register: 'Éditeur enregistré avec succès!',
    success_update: 'Éditeur mis à jour avec succès!',
    success_delete: 'Éditeur supprimé avec succès!',

    // Notifications (Validation/Erreur)
    validation_required: 'Champ obligatoire',
    validation_fill_all: 'Veuillez remplir tous les champs obligatoires.',
    error_load_default: 'Erreur lors du chargement de la liste des éditeurs.',
    error_connection: 'Vérifiez votre connexion ou jeton d\'accès.',
    error_register_default: 'Échec de l\'enregistrement de l\'éditeur. Veuillez réessayer.',
    error_update_default: 'Échec de la mise à jour de l\'éditeur.',
    error_delete_default: 'Échec de la suppression de l\'éditeur.',
    error_delete_linked: 'Cet éditeur ne peut pas être supprimé car il est lié à un ou plusieurs livres.',
  },
  BooksPage: {
    title: 'Livres',
    register_button: 'Enreg.',
    update_button: 'Mettre à jour',
    delete_button: 'Supprimer',
    cancel_button: 'Annuler',
    back_button: 'Retourner',
    search_placeholder: 'Rechercher un livre',
    actions_header: 'Actions',
    not_applicable: 'N/A',
    loading_books: 'Chargement des livres...',

    // Colonnes du Tableau
    column_title: 'Titre',
    column_author: 'Auteur',
    column_launch_date: 'Lancement',
    column_total: 'Total',
    column_in_use: 'En cours d\'utilisation',
    column_publisher: 'Éditeur',

    // Modales et Champs de Saisie
    modal_register_title: 'Enregistrer un livre',
    modal_update_title: 'Mettre à jour le livre',
    input_title_label: 'Titre du livre',
    input_author_label: 'Auteur',
    input_launch_date_label: 'Date de lancement',
    input_total_quantity_label: 'Quantité totale',
    input_publisher_label: 'Éditeur',

    // Confirmation de Suppression
    confirm_delete_q1: 'Êtes-vous sûr de vouloir supprimer ce livre?',
    confirm_delete_q2: 'Cette action est irréversible.',

    // Notificaciones (Succès)
    success_register: 'Livre enregistré avec succès!',
    success_update: 'Livre mis à jour avec succès!',
    success_delete: 'Livre supprimé avec succès!',

    // Notificaciones (Validation/Erreur)
    validation_fill_all: 'Veuillez remplir tous les champs obligatoires pour enregistrer.',
    error_load_default: 'Erreur lors du chargement de la liste des livres.',
    error_connection: 'Erreur lors du chargement des données de l\'API. Vérifiez le serveur/réseau.',
    error_save_default: 'Erreur lors de l\'enregistrement du livre.',
    error_delete_default: 'Erreur lors de la suppression du livre.',
    error_delete_linked: 'Impossible de supprimer le livre. Il est lié à une ou plusieurs locations actives.',
  },
  RentalsPage: {
    title: 'Locations',
    register_button: 'Enreg.',
    update_button: 'Mettre à jour',
    delete_button: 'Supprimer',
    cancel_button: 'Annuler',
    confirm_button: 'Confirmer',
    back_button: 'Retourner',
    search_placeholder: 'Rechercher une location',
    actions_header: 'Actions',
    not_applicable_short: '-',
    loading_rentals: 'Chargement des locations...',

    // Statut de la Location
    status_rented: 'Loué',
    status_in_time: 'À Temps',
    status_late: 'En Retard',
    status_delivered_on_time: 'Rendu à Temps',
    status_delivered_with_delay: 'Rendu avec Retard',

    // Colonnes du Tableau
    column_renter: 'Locataire',
    column_book: 'Livre',
    column_rent_date: 'Loué le',
    column_deadline: 'Échéance',
    column_devolution_date: 'Retour',
    column_status: 'Statut',

    // Tooltips
    tooltip_receive: 'Marquer comme Reçu',
    tooltip_edit: 'Modifier la Date Limite',

    // Modales et Champs de Saisie
    modal_register_title: 'Enregistrer une Location',
    modal_update_title: 'Mettre à jour la Location',
    input_renter_label: 'Locataire',
    input_book_label: 'Livre',
    input_rent_date_label: 'Date de Location',
    input_deadline_label: 'Date Limite de Retour',
    available_caption: 'Disponible',

    // Confirmation de Réception
    confirm_receive_title: 'Confirmer la Réception',
    confirm_receive_q1: 'Voulez-vous marquer le livre',
    confirm_receive_q2: 'comme reçu? La date d\'aujourd\'hui sera enregistrée comme date de retour.',

    // Notificaciones (Succès)
    success_register: 'Location enregistrée avec succès!',
    success_update: 'Location mise à jour avec succès!',
    success_receive: 'Livre reçu avec succès! Statut mis à jour.',

    // Notificaciones (Validation/Erreur)
    validation_fill_all: 'Veuillez remplir tous les champs obligatoires pour enregistrer.',
    error_load_default: 'Erreur lors du chargement des données. Vérifiez votre connexion et vos permissions.',
    error_save_default: 'Erreur lors de l\'enregistrement de la location.',
    error_receive_default: 'Erreur lors de l\'enregistrement de la réception. Vérifiez le serveur.',
  },
  UsersPage: {
    title: 'Utilisateurs',
    register_button: 'Enreg.',
    update_button: 'Mettre à jour',
    delete_button: 'Supprimer',
    cancel_button: 'Annuler',
    close_button: 'Fermer',
    back_button: 'Retourner',
    search_placeholder: 'Rechercher un utilisateur',
    actions_header: 'Actions',
    loading_users: 'Chargement des utilisateurs...',

    // Types d'Utilisateur (Roles)
    role_user: 'Utilisateur',
    role_admin: 'Administrateur',

    // Colonnes du Tableau
    column_name: 'Nom',
    column_email: 'Email',
    column_role: 'Permission',

    // Tooltips
    tooltip_edit: 'Modifier l\'utilisateur',
    tooltip_delete: 'Supprimer l\'utilisateur',

    // Modales et Champs de Saisie
    modal_register_title: 'Enregistrer un Utilisateur',
    modal_update_title: 'Mettre à jour l\'Utilisateur',
    input_name_label: 'Nom de l\'utilisateur',
    input_email_label: 'Email',
    input_password_label: 'Mot de passe',
    input_new_password_label: 'Nouveau Mot de passe (Optionnel)',
    input_confirm_password_label: 'Confirmer le Nouveau Mot de passe',
    input_role_label: 'Type d\'utilisateur',

    // Confirmation de Suppression
    confirm_delete_q1: 'Êtes-vous sûr de vouloir supprimer cet utilisateur?',
    confirm_delete_q2: 'Après cette action, il n\'y aura pas de retour en arrière.',

    // Notificaciones (Succès)
    success_register: 'Utilisateur enregistré avec succès!',
    success_update: 'Utilisateur mis à jour avec succès!',
    success_delete: 'Utilisateur supprimé avec succès!',

    // Notificaciones (Validation/Erreur)
    validation_fill_all: 'Veuillez remplir tous les champs obligatoires.',
    validation_password_mismatch: 'Les nouveaux mots de passe ne correspondent pas!',
    validation_name_email_required: 'Le nom et l\'email sont obligatoires.',
    error_load_default: 'Échec du chargement des utilisateurs.',
    error_network: 'Erreur de réseau.',
    error_check_console: 'Vérifiez la console.',
    error_register_default: 'Erreur lors de l\'enregistrement de l\'utilisateur.',
    error_update_default: 'Erreur lors de la mise à jour de l\'utilisateur.',
    error_delete_default: 'Erreur lors de la suppression de l\'utilisateur.',
  },
  MainLayout: {
    app_title: 'Location de Livres',
    menu_aria_label: 'Menu Principal',
    logout_button: 'Déconnexion',
    language_selector: 'Langue',

    // Menu Déroulant de l'Utilisateur
    user_short_label: 'Moi',
    user_full_label: 'Utilisateur',
    user_info_title: 'Informations:',
    user_name_label: 'Nom d\'Utilisateur',
    user_email_label: 'Email',
    user_permission_label: 'Permission',

    // Liens du Menu Latéral
    link_dashboard: 'Dashboard',
    link_renters: 'Locataires',
    link_publishers: 'Éditeurs',
    link_books: 'Livres',
    link_rentals: 'Locations',
    link_users: 'Utilisateurs',
  },
  general: {
    data_load_error: 'Échec du chargement des données du tableau de bord.',
    language_updated: 'Langue mise à jour.',
  },
};