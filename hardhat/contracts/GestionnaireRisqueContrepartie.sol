// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GestionnaireRisques {
    // Structures de données
    struct Contrepartie {
        address identifiant;
        uint256 creditScore;
        uint256 limite;
        uint256 exposition;
        uint256 garantie;
        bool estActive;
    }

    struct EnregistrementTransaction {
        address expediteur;
        address recepteur;
        int256 valeur;
        uint256 horodatage;
    }

    // Variables d'état
    address public administrateur;

    mapping(address => Contrepartie) public contreparties;
    mapping(address => mapping(address => int256)) public relationsExposition;

    address[] public listeContreparties;
    EnregistrementTransaction[] private historique;

    // Événements
    event NouvelleContrepartie(address indexed identifiant, uint256 limite, uint256 creditScore);
    event MiseAJourExposition(address indexed expediteur, address indexed contrepartie, int256 nouvelleExposition);
    event AlerteLimiteDepassee(address indexed contrepartie, uint256 expositionActuelle, uint256 limite);
    event AlerteRisqueEleve(address indexed contrepartie, string typeAlerte, uint256 valeur);
    event MiseAJourGarantie(address indexed contrepartie, uint256 nouvelleGarantie);
    event NouvelleOperation(address indexed de, address indexed vers, int256 valeur, uint256 horodatage);
    event ReactivationContrepartie(address indexed identifiant);

    // Modificateurs
    modifier seulementAdministrateur() {
        require(msg.sender == administrateur, "Acces reserve a l'administrateur");
        _;
    }

    modifier contrepartieActive(address _identifiant) {
        require(contreparties[_identifiant].estActive, "Contrepartie inactive ou inexistante");
        _;
    }

    // Constructeur
    constructor() {
        administrateur = msg.sender;
    }

    // Fonctions d'administration
    function ajouterContrepartie(
        address _identifiant,
        uint256 _creditScore,
        uint256 _limite
    ) public seulementAdministrateur {
        require(_identifiant != address(0), "Adresse invalide");
        require(contreparties[_identifiant].identifiant == address(0), "Contrepartie deja existante");
        require(_creditScore > 0, "Score de credit invalide");
        require(_limite > 0, "Limite invalide");

        contreparties[_identifiant] = Contrepartie({
            identifiant: _identifiant,
            creditScore: _creditScore,
            limite: _limite,
            exposition: 0,
            garantie: 0,
            estActive: true
        });

        listeContreparties.push(_identifiant);
        emit NouvelleContrepartie(_identifiant, _limite, _creditScore);
    }

    function reactiverContrepartie(address _identifiant) public seulementAdministrateur {
        Contrepartie storage c = contreparties[_identifiant];
        require(!c.estActive, "Contrepartie deja active");
        require(c.exposition <= c.limite, "Exposition depasse la limite");
        require(calculerRatioGarantie(_identifiant) >= 50, "Garantie insuffisante");

        c.estActive = true;
        emit ReactivationContrepartie(_identifiant);
    }

    // Mise à jour des contreparties
    function actualiserExposition(address _identifiant, uint256 ajoutExposition) public {
        Contrepartie storage contrepartie = contreparties[_identifiant];
        require(contrepartie.estActive, "Contrepartie inactive");

        contrepartie.exposition += ajoutExposition;

        emit MiseAJourExposition(msg.sender, _identifiant, int256(contrepartie.exposition));
        verifierLimites(_identifiant);
    }

    function actualiserGarantie(address _identifiant, uint256 nouvelleGarantie) public seulementAdministrateur {
        Contrepartie storage contrepartie = contreparties[_identifiant];
        require(contrepartie.identifiant != address(0), "Contrepartie inexistante");

        contrepartie.garantie = nouvelleGarantie;

        emit MiseAJourGarantie(_identifiant, nouvelleGarantie);
        verifierLimites(_identifiant);
    }

    // Gestion des transactions
    function enregistrerTransaction(
        address recepteur,
        int256 valeur
    ) public contrepartieActive(msg.sender) contrepartieActive(recepteur) {
        require(valeur != 0, "Valeur invalide");

        int256 expositionActuelle = relationsExposition[msg.sender][recepteur];
        expositionActuelle += valeur;
        relationsExposition[msg.sender][recepteur] = expositionActuelle;

        uint256 absValeur = uint256(valeur < 0 ? -valeur : valeur);
        contreparties[msg.sender].exposition -= absValeur;
        contreparties[recepteur].exposition += absValeur;

        historique.push(EnregistrementTransaction({
            expediteur: msg.sender,
            recepteur: recepteur,
            valeur: valeur,
            horodatage: block.timestamp
        }));

        emit NouvelleOperation(msg.sender, recepteur, valeur, block.timestamp);

        verifierLimites(msg.sender);
        verifierLimites(recepteur);
    }

    // Calculs du risque et vérifications
    function calculerRisque(address _identifiant) public view returns (uint256) {
        Contrepartie storage c = contreparties[_identifiant];
        require(c.limite > 0 && c.creditScore > 0, "Parametres invalides");
        return (c.exposition * 1e4) / (c.limite * c.creditScore);
    }

    function calculerRatioGarantie(address _identifiant) public view returns (uint256) {
        Contrepartie storage c = contreparties[_identifiant];
        return c.exposition == 0 ? 100 : (c.garantie * 100) / c.exposition;
    }

    function verifierLimites(address _identifiant) internal {
        Contrepartie storage c = contreparties[_identifiant];
        uint256 ratioGarantie = calculerRatioGarantie(_identifiant);
        uint256 risque = calculerRisque(_identifiant);

        if (c.exposition > c.limite) {
            c.estActive = false;
            emit AlerteLimiteDepassee(_identifiant, c.exposition, c.limite);
        }

        if (ratioGarantie < 50) {
            emit AlerteRisqueEleve(_identifiant, "Garantie insuffisante", ratioGarantie);
        }

        if (risque > 200) {
            emit AlerteRisqueEleve(_identifiant, "Risque eleve", risque);
        }
    }

    // Consultation
    function obtenirListeContreparties() public view returns (address[] memory) {
        return listeContreparties;
    }

    function obtenirHistoriqueTransactions() public view returns (EnregistrementTransaction[] memory) {
        return historique;
    }
}