var $formBuilderTextInput = $("#form-builder-text");
var $formBuilderContainer = $("#form-builder-container");
var formBuilder;

// When user add manuall via wikiCode a list or a formId that does not exist, keep the value
// so it can be added the select option list
var listAndFormUserValues = {};
// Fill the listAndFormUserValues
var text = $formBuilderTextInput.val().trim();
var textFields = text.split("\n");
for (var i = 0; i < textFields.length; i++) {
  var textField = textFields[i];
  var fieldValues = textField.split("***");
  if (fieldValues.length > 1) {
    var wikiType = fieldValues[0];
    if (
      [
        "checkboxfiche",
        "checkbox",
        "liste",
        "radio",
        "listefiche",
        "radiofiche",
      ].indexOf(wikiType) > -1 &&
      fieldValues[1] &&
      !(fieldValues[1] in formAndListIds)
    ) {
      listAndFormUserValues[fieldValues[1]] = fieldValues[1];
    }
  }
}
// Custom fields to add to form builder
var fields = [
  // {
  //   label: "Sélecteur de date",
  //   name: "jour",
  //   attrs: { type: "date" },
  //   icon: '<i class="far fa-calendar-alt"></i>',
  // },
  {
    label: "Texte court",
    name: "text",
    attrs: { type: "text" },
    icon:
      '<svg height="512pt" viewBox="0 -90 512 512" width="512pt" xmlns="http://www.w3.org/2000/svg"><path d="m452 0h-392c-33.085938 0-60 26.914062-60 60v212c0 33.085938 26.914062 60 60 60h392c33.085938 0 60-26.914062 60-60v-212c0-33.085938-26.914062-60-60-60zm20 272c0 11.027344-8.972656 20-20 20h-392c-11.027344 0-20-8.972656-20-20v-212c0-11.027344 8.972656-20 20-20h392c11.027344 0 20 8.972656 20 20zm-295-151v131h-40v-131h-57v-40h152v40zm40 91h40v40h-40zm80 0h40v40h-40zm80 0h40v40h-40zm0 0"/></svg>',
  },
  {
    label: "Géolocalisation sur une carte",
    name: "carte_google",
    attrs: { type: "carte_google" },
    icon: '<i class="fas fa-map-marked-alt"></i>',
  },
  {
    label: "Image",
    name: "image",
    attrs: { type: "image" },
    icon: '<i class="fas fa-image"></i>',
  },
  {
    label: "Email",
    name: "champs_mail",
    attrs: { type: "champs_mail" },
    icon: '<i class="fas fa-envelope"></i>',
  },
  {
    label: "Mots clés",
    name: "tags",
    attrs: { type: "tags" },
    icon: '<i class="fas fa-tags"></i>',
  },
  {
    label: "Inscription Liste Diffusion",
    name: "inscriptionliste",
    attrs: { type: "inscriptionliste" },
    icon: '<i class="fas fa-mail-bulk"></i>',
  },
  {
    label: "Custom HTML",
    name: "labelhtml",
    attrs: { type: "labelhtml" },
    icon: '<i class="fas fa-code"></i>',
  },
  {
    label: "Config Droits d'accès",
    name: "acls",
    attrs: { type: "acls" },
    icon: '<i class="fas fa-user-lock"></i>',
  },
  {
    label: "Config Thème de la fiche",
    name: "metadatas",
    attrs: { type: "metadatas" },
    icon: '<i class="fas fa-palette"></i>',
  },
  {
    label: "Bookmarklet",
    name: "bookmarklet",
    attrs: { type: "bookmarklet" },
    icon: '<i class="fas fa-bookmark"></i>',
  },
  {
    label: "Liste des fiches liées",
    name: "listefichesliees",
    attrs: { type: "listefichesliees" },
    icon: '<i class="fas fa-th-list"></i>',
  },
  {
    label: "Créer un utilisateur lorsque la fiche est validée",
    name: "utilisateur_wikini",
    attrs: { type: "utilisateur_wikini" },
    icon: '<i class="fas fa-user"></i>',
  },
  {
    name: "collaborative_doc",
    attrs: { type: "collaborative_doc" },
  },
  {
    label: "Titre Automatique",
    name: "titre",
    attrs: { type: "titre" },
    icon: '<i class="fas fa-heading"></i>',
  },
  {
    label: "Custom",
    name: "custom",
    attrs: { type: "custom" },
    icon: '<i class="fas fa-question-circle"></i>',
  },
];

// Some attributes configuration used in multiple fields
var visibilityOptions = {
  " * ": "Tout le monde",
  " + ": "Utilisateurs identifiés",
  " % ": "Propriétaire de la fiche et admins",
  "@admins": "Membre du groupe admin",
};
var aclsOptions = {
  ...visibilityOptions,
  ...{
    user:
      "Utilisateur (lorsqu'on créé un utilisateur en même temps que la fiche)",
  },
};
var readConf = { label: "Peut être lu par", options: visibilityOptions };
var writeconf = { label: "Peut être saisi par", options: visibilityOptions };
var searchableConf = {
  label: "Présence dans le moteur de recherche",
  options: { "": "Non", 1: "Oui" },
};
var semanticConf = {
  label: "Type sémantique du champ",
  placeholder: "Ex: https://schema.org/name",
};
var selectConf = {
  subtype2: {
    label: "Origine des données",
    options: {
      list: "Une liste",
      form: "Un Formulaire Bazar",
    },
  },
  listeOrFormId: {
    label: "Choix de la liste/du formulaire",
    options: {
      ...{ "": "" },
      ...formAndListIds.lists,
      ...formAndListIds.forms,
      ...listAndFormUserValues,
    },
  },
  listId: {
    label: "",
    options: { ...formAndListIds.lists, ...listAndFormUserValues },
  },
  formId: {
    label: "",
    options: { ...formAndListIds.forms, ...listAndFormUserValues },
  },
  defaultValue: {
    label: "Valeur par défaut",
  },
  hint: { label: "Texte d'aide" },
  read: readConf,
  write: writeconf,
  semantic: semanticConf,
  // searchable: searchableConf -> 10/19 Florian say that this conf is not working for now
};

// Attributes to be configured for each field
var typeUserAttrs = {
  text: {
    size: { label: "Nb caractères visibles" },
    maxlength: { label: "Longueur max" },
    hint: { label: "Texte d'aide" },
    separator: { label: "" }, // separate important attrs from others
    subtype: {
      label: "Type",
      options: {
        text: "Texte",
        number: "Nombre",
        range: "Slider",
        url: "Adresse url",
        password: "Mot de passe",
        color: "Couleur",
      },
    },
    read: readConf,
    write: writeconf,
    semantic: semanticConf,
  },
  champs_mail: {
    hint: { label: "Texte d'aide" },
    separator: { label: "" }, // separate important attrs from others
    replace_email_by_button: {
      label: "Remplacer l'email par un bouton contact",
      options: { "": "Non", form: "Oui" },
    },
    send_form_content_to_this_email: {
      label: "Envoyer le contenu de la fiche à cet email",
      options: { 0: "Non", 1: "Oui" },
    },
    // searchable: searchableConf, -> 10/19 Florian say that this conf is not working for now
    read: readConf,
    write: writeconf,
    semantic: semanticConf,
  },
  carte_google: {
    name_latitude: { label: "Nom champ latitude", value: "bf_latitude" },
    name_longitude: { label: "Nom champ longitude", value: "bf_longitude" },
  },
  date: {
    today_button: {
      label: "Initialiser à Aujourd'hui",
      options: { " ": "Non", today: "Oui" },
    },
    hint: { label: "Texte d'aide" },
    read: readConf,
    write: writeconf,
    semantic: semanticConf,
  },
  image: {
    hint: { label: "Texte d'aide" },
    name2: { label: "Name", value: "bf_image" },
    thumb_height: { label: "Hauteur Vignette", value: "140" },
    thumb_width: { label: "Largeur Vignette", value: "140" },
    resize_height: { label: "Hauteur redimension", value: "600" },
    resize_width: { label: "Largeur redimension", value: "600" },
    align: {
      label: "Alignement",
      value: "right",
      options: { left: "Gauche", center: "Centre", right: "Droite" },
    },
    read: readConf,
    write: writeconf,
    semantic: semanticConf,
  },
  select: selectConf,
  "checkbox-group": {
    ...selectConf,
    ...{
      fillingMode: {
        label: "Mode de saisie",
        options: {
          " ": "Normal",
          tags: "En Tags",
          dragndrop: "Drag & drop",
        },
      },
    },
  },
  "radio-group": selectConf,
  textarea: {
    syntax: {
      label: "Format d'écriture",
      options: {
        wiki: "Wiki",
        html: "Editeur Wysiwyg",
        nohtml: "Texte non interprété",
      },
    },
    hint: { label: "Texte d'aide" },
    size: { label: "Largeur champ de saisie" },
    read: readConf,
    write: writeconf,
    semantic: semanticConf,
  },
  file: {
    maxsize: { label: "Taille max" },
    hint: { label: "Texte d'aide" },
    read: readConf,
    write: writeconf,
    semantic: semanticConf,
  },
  tags: {
    hint: { label: "Texte d'aide" },
    read: readConf,
    write: writeconf,
    semantic: semanticConf,
  },
  inscriptionliste: {
    subscription_email: { label: "Email pour s'inscrire" },
    email_field_id: {
      label: "Champ du formulaire fournissant l'email à inscire",
      value: "bf_mail",
    },
    mailing_list_tool: {
      label: "Type de service de diffusion",
      options: { "": "", ezmlm: "Ezmlm", sympa: "Sympa" },
    },
  },
  labelhtml: {
    label: { value: "Custom HTML" },
    content_saisie: { label: "Contenu lors la saisie" },
    content_display: { label: "Contenu lors de l'affichage d'une fiche" },
  },
  utilisateur_wikini: {
    name_field: { label: "Champ pour le nom d'utilisateur", value: "bf_titre" },
    email_field: {
      label: "Champ pour l'email de l'utilisateur",
      value: "bf_mail",
    },
  },
  acls: {
    read: { label: "Peut voir la fiche", options: aclsOptions },
    write: { label: "Peut éditer la fiche", options: aclsOptions },
    comment: { label: "Peut commenter la fiche", options: aclsOptions },
  },
  metadatas: {
    theme: {
      label: "Nom du thème",
      placeholder: "margot, interface, colibris",
    },
    squelette: { label: "Squelette", value: "1col.tpl.html" },
    style: { label: "Style", placeholder: "bootstrap.min.css..." },
    image: { label: "Image de fond", placeholder: "foret.jpg..." },
  },
  bookmarklet: {},
  collaborative_doc: {},
  titre: {},
  listefichesliees: {
    id: { label: "id du formulaire lié" },
    query: {
      label: "Query",
      placeholder: "Voir doc sur https://yeswiki.net/?DocQuery/iframe",
    },
    param: {
      label: "Params de l'action",
      placeholder: 'Ex: champs="bf_nom" ordre="desc"',
    },
    number: { label: "Nombre de fiches à ficher", placeholder: "" },
    template: {
      label: "Template de restitution",
      placeholder:
        'Exple: template="liste_liens.tpl.html (par défault = accordéon)"',
    },
    type_link: {
      label: "Type de fiche liée",
      placeholder:
        "mettre checkbox ici si vos fiches liées le sont via un checkbox",
    },
    read: readConf,
    write: writeconf,
    semantic: semanticConf,
  },
  custom: {
    param0: { label: "Param0" },
    param1: { label: "Param1" },
    param2: { label: "Param2" },
    param3: { label: "Param3" },
    param4: { label: "Param4" },
    param5: { label: "Param5" },
    param6: { label: "Param6" },
    param7: { label: "Param7" },
    param8: { label: "Param8" },
    param9: { label: "Param9" },
    param10: { label: "Param10" },
    param11: { label: "Param11" },
    param12: { label: "Param12" },
    param13: { label: "Param13" },
    param14: { label: "Param14" },
  },
};

// How a field is represented in the formBuilder view
var templates = {
  champs_mail: function (fieldData) {
    return {
      field: `<input id="${fieldData.name}" type="email" value="" />`
    };
  },
  carte_google: function (fieldDate) {
    return {
      field: "Geolocation à partir d'un champ bf_adresse1 (ou bf_adresse2) et/ou bf_ville et/ou bf_pays",
    };
  },
  image: function (fieldDate) {
    return { field: '<input type="file"/>' };
  },
  text: function (fieldData) {
    var string = `<input type="${fieldData.subtype}"`;
    if (fieldData.subtype == "url")
      string += ` placeholder="${fieldData.value || ""}"/>`;
    else if (fieldData.subtype == "range" || fieldData.subtype == "number")
      string += ` min="${fieldData.size || ""}" max="${fieldData.maxlength || ""}"/>`;
    else 
      string += ` value="${fieldData.value}"/>`;
    return { field: string };
  },
  tags: function (field) {
    return { field: "<input/>" };
  },
  inscriptionliste: function (field) {
    return { field: '<input type="checkbox"/>' };
  },
  labelhtml: function (field) {
    return {
      field:
        `<div>${field.content_saisie || ""}</div>
         <div>${field.content_display || ""}</div>`,
    };
  },
  utilisateur_wikini: function (field) {
    return { field: "" };
  },
  acls: function (field) {
    return { field: "" };
  },
  metadatas: function (field) {
    return { field: "" };
  },
  bookmarklet: function (field) {
    return { field: "" };
  },
  listefichesliees: function (field) {
    return { field: "" };
  },
  collaborative_doc: function (field) {
    return { field: "Document collaboratif" };
  },
  titre: function (field) {
    return { field: field.value };
  },
  custom: function (field) {
    return { field: "" };
  },
};

// Mapping betwwen yes wiki syntax and FormBuilder json syntax
var defaultMapping = {
  0: "type",
  1: "name",
  2: "label",
  3: "size",
  4: "maxlength",
  5: "value",
  6: "pattern",
  7: "subtype",
  8: "required",
  9: "searchable",
  10: "hint",
  11: "read",
  12: "write",
  14: "semantic",
};
var lists = {
  ...defaultMapping,
  ...{ 1: "listeOrFormId", 5: "defaultValue", 6: "name" },
};
var yesWikiMapping = {
  text: defaultMapping,
  number: defaultMapping,
  textarea: defaultMapping,
  champs_mail: {
    ...defaultMapping,
    ...{ 6: "replace_email_by_button", 9: "send_form_content_to_this_email" },
  },
  carte_google: {
    0: "type",
    1: "name_latitude",
    2: "name_longitude",
    3: "?",
    4: "?",
  },
  date: { ...defaultMapping, ...{ 5: "today_button" } },
  image: {
    ...defaultMapping,
    ...{
      1: "name2",
      3: "thumb_height",
      4: "thumb_width",
      5: "resize_height",
      6: "resize_width",
      7: "align",
    },
  },
  select: lists,
  "checkbox-group": { ...lists, ...{ 7: "fillingMode" } },
  "radio-group": lists,
  textarea: { ...defaultMapping, ...{ 4: "rows", 7: "syntax" } },
  file: { ...defaultMapping, ...{ 3: "maxsize" } },
  tags: defaultMapping,
  inscriptionliste: {
    0: "type",
    1: "subscription_email",
    2: "label",
    3: "email_field_id",
    4: "mailing_list_tool",
  },
  labelhtml: { 0: "type", 1: "content_saisie", 2: "", 3: "content_display" },
  utilisateur_wikini: { 0: "type", 1: "name_field", 2: "email_field" },
  titre: { 0: "type", 1: "value", 2: "label" },
  acls: { 0: "type", 1: "read", 2: "write", 3: "comment" },
  metadatas: { 0: "type", 1: "theme", 2: "squelette", 3: "style", 4: "image" },
  hidden: { 0: "type", 1: "name", 2: "value" },
  bookmarklet: { 0: "type", 1: "name", 2: "label", 3: "value" },
  listefichesliees: {
    0: "type",
    1: "id",
    2: "query",
    3: "param",
    4: "number",
    5: "template",
    6: "type_link",
  },
  collaborative_doc: defaultMapping,
  custom: {
    0: "param0",
    1: "param1",
    2: "param2",
    3: "param3",
    4: "param4",
    5: "param5",
    6: "param6",
    7: "param7",
    8: "param8",
    9: "param9",
    10: "param10",
    11: "param11",
    12: "param12",
    13: "param13",
    14: "param14",
  },
};
// Mapping betwwen yeswiki field type and standard field implemented by form builder
var yesWikiTypes = {
  lien_internet: { type: "text", subtype: "url" },
  mot_de_passe: { type: "text", subtype: "password" },
  // "nombre": { type: "text", subtype: "tel" },
  texte: { type: "text" }, // all other type text subtype (range, text, tel)
  textelong: { type: "textarea", subtype: "textarea" },
  listedatedeb: { type: "date" },
  listedatefin: { type: "date" },
  jour: { type: "date" },
  checkbox: { type: "checkbox-group", subtype2: "list" },
  liste: { type: "select", subtype2: "list" },
  radio: { type: "radio-group", subtype2: "list" },
  checkboxfiche: { type: "checkbox-group", subtype2: "form" },
  listefiche: { type: "select", subtype2: "form" },
  radiofiche: { type: "radio-group", subtype2: "form" },
  fichier: { type: "file", subtype: "file" },
  champs_cache: { type: "hidden" },
};

function initializeFormbuilder(formAndListIds) {
  // FormBuilder conf
  formBuilder = $formBuilderContainer.formBuilder({
    showActionButtons: false,
    fields: fields,
    i18n: { locale: 'fr-FR' },
    templates: templates,
    disableFields: [
      "number",
      "button",
      "autocomplete",
      "checkbox",
      "paragraph",
      "header",
      "collaborative_doc",
    ],
    controlOrder: ["text", "textarea", "jour", "image", "file", "champs_mail", "tags"],
    disabledAttrs: [
      "access",
      "placeholder",
      "className",
      "inline",
      "toggle",
      "description",
      "other",
      "multiple",
    ],
    typeUserAttrs: typeUserAttrs,
  });

  // Each 300ms update the text field converting form bulder content into wiki syntax
  var formBuilderInitialized = false;
  setInterval(function () {
    if (!formBuilder || !formBuilder.actions || !formBuilder.actions.setData)
      return;
    if (!formBuilderInitialized) {
      initializeBuilderFromTextInput();
      formBuilderInitialized = true;
    }
    if ($formBuilderTextInput.is(":focus")) return;
    
    // Slugiy field names
    $(".fld-name").each(function () {
      var newValue = $(this)
        .val()
        .replace(/[^a-z^A-Z^_^0-9^{^}]/g, "_")
        .toLowerCase();
      $(this).val(newValue);
    });

    // Remove accidental br at the end of the labels
    $('.fld-label:not(.focus-initialized)')
      .addClass('focus-initialized')
      .on('focusout', function() {
        var newValue = $(this).html().replace(/(<div><br><\/div>)+$/g, '')
        // replace multiple '<div><br></div>' when at the end of the value
        newValue = newValue.replace(/(<br>)+$/g, '')
        // replace multiple '<br>' when at the end of the value
        $(this).html(newValue);
      });

    if ($("#form-builder-container").is(":visible")) {
      var formData = formBuilder.actions.getData();
      var wikiText = formatJsonDataIntoWikiText(formData);
      if (wikiText) $formBuilderTextInput.val(wikiText);
    }

    // when selecting between data source lists or forms, we need to populate again the listOfFormId select with the
    // proper set of options
    $(".radio-group-field, .checkbox-group-field, .select-field")
      .find("select[name=subtype2]:not(.initialized)")
      .change(function () {
        $(this).addClass("initialized");
        var visibleSelect = $(this)
          .closest(".form-field")
          .find("select[name=listeOrFormId]");
        selectedValue = visibleSelect.val();
        visibleSelect.empty();
        var optionToAddToSelect = $(this)
          .closest(".form-field")
          .find("select[name=" + $(this).val() + "Id] option");
        visibleSelect.append(new Option("", "", false));
        optionToAddToSelect.each(function () {
          var optionKey = $(this).attr("value");
          var optionLabel = $(this).text();
          var isSelected = optionKey == selectedValue;
          var newOption = new Option(optionLabel, optionKey, false, isSelected);
          visibleSelect.append(newOption);
        });
      })
      .trigger("change");

    // For checkbox, select etc... the name should be blank by default
    // so we replace the generated value by blank
    $(".radio-group-field .fld-name").each(function () {
      if ($(this).val().includes("radio_group_")) $(this).val("");
    });
    $(".checkbox-group-field .fld-name").each(function () {
      if ($(this).val().includes("checkbox_group_")) $(this).val("");
    });
    $(".select-field .fld-name").each(function () {
      if ($(this).val().includes("select_")) $(this).val("");
    });

    $(".text-field select[name=subtype]:not(.initialized)")
      .change(function () {
        $(this).addClass("initialized");
        $parent = $(this).closest(".form-field");
        if ($(this).val() == "range" || $(this).val() == "number") {
          $parent.find(".maxlength-wrap label").text("Valeur max");
          $parent.find(".size-wrap label").text("Valeur min");
        } else {
          $parent.find(".maxlength-wrap label").text("Longueur Max.");
          $parent.find(".size-wrap label").text("Nbre Caractères Visibles");
        }
        if ($(this).val() == "color") {
          $parent.find(".maxlength-wrap, .size-wrap").hide();
        } else {
          $parent.find(".maxlength-wrap, .size-wrap").show();
        }
      })
      .trigger("change");

    // in semantic field, we want to separate value by coma
    $(".fld-semantic").each(function () {
      var newVal = $(this)
        .val()
        .replace(/\s*,\s*/g, ",");
      newVal = newVal.replace(/\s+/g, ",");
      newVal = newVal.replace(/,+/g, ",");
      $(this).val(newVal);
    });

    // Changes icons and icones helpers
    $("a[type=remove].icon-cancel")
      .removeClass("icon-cancel")
      .addClass("glyphicon glyphicon-trash");
    $("a[type=copy].icon-copy").attr("title", "Dupliquer");
    $("a[type=edit].icon-pencil").attr("title", "Editer/Masquer");
  }, 300);

  $("#formbuilder-link").click(initializeBuilderFromTextInput);
}

function initializeBuilderFromTextInput() {
  var jsonData = parseWikiTextIntoJsonData($formBuilderTextInput.val());
  formBuilder.actions.setData(JSON.stringify(jsonData));
}

// transform a json object like "{ type: 'texte', name: 'bf_titre', label: 'Nom' .... }"
// into wiki text like "texte***bf_titre***Nom***255***255*** *** *** ***1***0***"
function formatJsonDataIntoWikiText(formData) {
  if (formData.length == 0) return null;
  var wikiText = "";

  for (var i = 0; i < formData.length; i++) {
    var wikiProps = {};
    var formElement = formData[i];
    var mapping = yesWikiMapping[formElement.type];

    for (var type in yesWikiTypes)
      if (
        formElement.type == yesWikiTypes[type].type &&
        (!formElement.subtype ||
          !yesWikiTypes[type].subtype ||
          formElement.subtype == yesWikiTypes[type].subtype) &&
        (!formElement.subtype2 ||
          formElement.subtype2 == yesWikiTypes[type].subtype2)
      ) {
        wikiProps[0] = type;
        break;
      }
    // for non mapped fields, we just keep the form type
    if (!wikiProps[0]) wikiProps[0] = formElement.type;

    for (var key in mapping) {
      var property = mapping[key];
      if (property != "type") {
        var value = formElement[property];
        if (["required", "access"].indexOf(property) > -1)
          value = value ? "1" : "0";
        wikiProps[key] = value;
      }
    }

    maxProp = Math.max.apply(Math, Object.keys(wikiProps));
    for (var j = 0; j <= maxProp; j++) {
      wikiText += wikiProps[j] || " ";
      wikiText += "***";
    }
    wikiText += "\n";
  }
  return wikiText;
}

// transform text with wiki text like "texte***bf_titre***Nom***255***255*** *** *** ***1***0***"
// into a json object "{ type: 'texte', name: 'bf_titre', label: 'Nom' .... }"
function parseWikiTextIntoJsonData(text) {
  var result = [];
  var text = text.trim();
  var textFields = text.split("\n");
  for (var i = 0; i < textFields.length; i++) {
    var textField = textFields[i];
    var fieldValues = textField.split("***");
    var fieldObject = {};
    if (fieldValues.length > 1) {
      var wikiType = fieldValues[0];
      var fieldType =
        wikiType in yesWikiTypes ? yesWikiTypes[wikiType].type : wikiType;
      // check that the fieldType really exists in our form builder
      if (!(fieldType in yesWikiMapping)) fieldType = "custom";

      var mapping = yesWikiMapping[fieldType];

      fieldObject["type"] = fieldType;
      fieldObject["subtype"] =
        wikiType in yesWikiTypes ? yesWikiTypes[wikiType].subtype : "";
      fieldObject["subtype2"] =
        wikiType in yesWikiTypes ? yesWikiTypes[wikiType].subtype2 : "";
      var start = fieldType == "custom" ? 0 : 1;
      for (var j = start; j < fieldValues.length; j++) {
        var value = fieldValues[j];
        var field = mapping && j in mapping ? mapping[j] : j;
        if (field == "required") value = value == "1" ? true : false;
        if (field) fieldObject[field] = value;
      }
      if (!fieldObject.label) {
        fieldObject.label = wikiType;
        for (var k = 0; k < fields.length; k++)
          if (fields[k].name == wikiType) fieldObject.label = fields[k].label;
      }
      result.push(fieldObject);
    }
  }
  console.log("parse result", result);
  return result;
}
