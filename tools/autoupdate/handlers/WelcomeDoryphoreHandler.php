<?php

use YesWiki\Core\YesWikiHandler;
use YesWiki\Core\Service\Performer;
use YesWiki\Core\Service\ThemeManager;
use AutoUpdate\AutoUpdate;
use AutoUpdate\Messages;
use AutoUpdate\Controller;

/*
 * This handler is called from /tools/autoupdate/Viewupdate.php only when upgrading from cercopitheque to doryphore.
 * whereas it is not used.
 * This handlers will not be useful for ectoplasme.
 */

class WelcomeDoryphoreHandler extends YesWikiHandler
{
    public function run()
    {
        // search data in session message
        $message = $this->wiki->GetMessage();
        
        $error = empty($message);

        // check integrity of data
        if (!$error) {
            $data = json_decode($message, true);
            $error = !is_array($data) && !isset($data['messages']) && !isset($data['baseURL']);
        }

        // on error call handler 'show'
        if ($error) {
            if (!empty($message)) {
                // save received message as if it was not extracted
                $this->wiki->SetMessage($message) ;
            }
            return $this->getService(Performer::class)->run('show', 'handler', []);
        }

        // check presence of theme margot
        $themeManager = $this->getService(ThemeManager::class) ;
        if (!$themeManager->loadTheme()) {
            // upgrade margot
            $get = $_GET;
            $get['upgrade'] = THEME_PAR_DEFAUT;
            $autoUpdate = new AutoUpdate($this->wiki);
            $messages = new Messages();
            $controller = new Controller($autoUpdate, $messages, $this->wiki);
            $resUpgradeMargot = $controller->run($get);
        }

        // finished rendering of autoupdate
        $output = '<h1>Welcome on Doryphore</h1>'."\n";
        // $output .= $message;
        $output .= $this->wiki->render("@autoupdate/update.twig", [
            'messages' => $data['messages'],
            'baseUrl' => $data['baseURL'],
        ]);
        $output .= (!empty($resUpgradeMargot)) ? $resUpgradeMargot :'';
        $output = $this->wiki->Header() . $output ;
        $output .= $this->wiki->Footer();
        return $output;
    }
}
