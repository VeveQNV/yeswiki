<?php

if (!defined("WIKINI_VERSION")) {
    die("acc&egrave;s direct interdit");
}

//ajout des styles css pour bazar, le calendrier, la google map
echo '  <link rel="stylesheet" href="'.$this->getBaseUrl().'/tools/bazar/presentation/styles/bazar.css" />'."\n";
