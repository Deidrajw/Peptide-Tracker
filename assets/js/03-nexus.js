const LIBRARY = [
  { name:"Placenta", sub:"Placental extract (sheep / deer / human sourced)", color:"#D4AF6A", tags:["Energy","Recovery","Hormone","Skin"], evidence:"investigational",
    benefits:["Reported increase in daily energy and reduced fatigue","Associated with improved skin texture, hydration, and elasticity","Reported support for hormone balance during perimenopause/menopause","Anecdotally linked to faster recovery and tissue repair","Some users report improved hair thickness/growth over months of use"],
    overview:"A biological extract product, not a single defined peptide — sourced from sheep, deer, or human placental tissue depending on the supplier. Ovine (sheep) and deer placenta are the most common sources in commercial products; human-sourced material is rarer and carries different sourcing/screening considerations. Composition varies by source and by manufacturer, so treat dosing as a starting guideline tied to a specific labeled vial, not a fixed molecule.",
    mechanism:"Placental extracts contain a mixture of growth factors, amino acids, and other bioactive compounds rather than one active ingredient — the reasoning behind reported effects (energy, hormone balance, tissue repair, skin/hair changes) is generally attributed to this broader growth-factor content rather than a single mechanism, and is far less characterized in research literature than single-molecule peptides.",
    meta:{ vial:"600mg", "loading dose":"120mg/day (60mg AM + 60mg PM)", "maintenance dose":"120mg/week", route:"SubQ", "vial life":"~5 wks at maintenance dose", "protocol length":"13 wks total" },
    cycleInfo:"13-week protocol as commonly described: 2 weeks daily loading + 11 weeks weekly maintenance = 13 weeks total. A single 600mg vial covers roughly 5 weeks once you're on the weekly 120mg maintenance dose (600 ÷ 120 = 5).",
    timingInfo:"Weeks 1–2: split into two daily injections (60mg morning, 60mg night). Weeks 3–13: one weekly injection of 120mg. This means the schedule itself changes partway through — start tracking at daily (every 1 day), then switch to weekly via that compound's Schedule Settings once week 2 ends. The app doesn't automatically switch this for you.",
    stacks:["Often used as a standalone protocol rather than stacked, given it's already a multi-component extract."],
    safety:"Sourced biological material (animal or human placental tissue) carries different safety/sourcing considerations than synthetic peptides — screening, purity, and regulatory oversight vary significantly by supplier and by source species. This is an unapproved research/wellness product with limited controlled human trial data; individual results vary, and it is not intended for use during pregnancy." },


  { name:"CJC-1295 / Ipamorelin Blend", sub:"GHRH + GHRP combination", color:"#9CDC5C", tags:["GH","Recovery","Sleep","Blend"], evidence:"investigational", blend:["CJC-1295 no DAC","Ipamorelin"],
    benefits:["Researched for increased natural growth hormone pulses during sleep","Reported improvements in sleep depth and recovery quality","Associated with gradual lean body composition changes over months","Reported support for skin quality and connective tissue recovery","Ipamorelin's selectivity means less appetite spike than older GH secretagogues"],
    overview:"One of the most common GH-secretagogue combinations in research use — CJC-1295 (no DAC) and Ipamorelin are two different compounds usually pre-mixed or co-administered in the same injection. Neither is a growth hormone itself; together they're intended to amplify the body's own natural GH pulses.",
    mechanism:"CJC-1295 is a GHRH analog — it raises the baseline signal telling the pituitary to release GH. Ipamorelin is a selective GHRP/ghrelin-receptor agonist — it triggers an actual GH pulse with minimal effect on cortisol or appetite compared to older secretagogues like GHRP-6. Combining a GHRH analog with a GHRP is a classic pairing because they work through different receptors and are reported to produce a larger pulse together than either alone.",
    meta:{ dose:"CJC 100mcg + Ipa 200mcg (typical)", freq:"1-2× daily", route:"SubQ", halfLife:"CJC ~30min · Ipa ~2h", storage:"Reconstituted: 2–8 °C", cycle:"Typically cycled, e.g. 8-12 wks on" },
    cycleInfo:"Commonly cycled rather than continuous — an on/off pattern is often used to avoid pituitary desensitization, though practices vary. Some run it continuously at conservative doses.",
    timingInfo:"Most often dosed before bed (aligns with the body's largest natural GH pulse during deep sleep) and/or fasted in the morning — food, especially carbs/sugar, can blunt the GH response if dosed too close to a meal.",
    stacks:["Often the two are sold pre-mixed in one vial at a fixed ratio — check your supplier's labeled concentration before logging doses separately."],
    safety:"Because this is two compounds, side effects can come from either — CJC-1295 more associated with water retention/flushing, Ipamorelin generally milder but can still cause injection-site reactions or a temporary hunger spike. Track symptoms per-compound where you can tell them apart, since attributing a symptom to the wrong half of the blend will muddy your own data." },

  { name:"Wolverine Blend", sub:"BPC-157 + TB-500", color:"#C9A0FF", tags:["Recovery","Injury","Blend"], evidence:"investigational", blend:["BPC-157","TB-500"],
    benefits:["Combines two of the most-researched recovery peptides into one protocol","Reported faster recovery from soft-tissue injuries (tendon, ligament, muscle)","Associated with reduced inflammation at injury sites","Commonly used alongside physical therapy for injury-specific recovery windows","Reported gut-lining support from the BPC-157 component specifically"],
    overview:"A widely-used two-compound recovery combination named for its reputed \"fast healing\" reputation. BPC-157 and TB-500 are each researched individually for tissue repair, and are very commonly stacked together rather than used alone — this is one of the most searched-for named blends in the research-peptide community.",
    mechanism:"BPC-157 (a stable fragment derived from a gastric protective protein) is associated with angiogenesis and tendon/ligament/gut healing in animal research. TB-500 (a synthetic fragment of Thymosin Beta-4) is associated with actin regulation, cell migration, and reduced inflammation at injury sites. They're believed to act through different pathways, which is the rationale for stacking rather than choosing one.",
    meta:{ dose:"BPC 0.25-0.5mg + TB-500 2-2.5mg (typical)", freq:"BPC often daily, TB-500 often 2×/week", route:"SubQ, often near injury site", storage:"Reconstituted: 2–8 °C, use within ~4 wks", cycle:"Often 4-8 wks per injury" },
    cycleInfo:"Commonly run for the duration of a specific injury's recovery (e.g. 4-8 weeks) rather than continuously — many stop once the injury has resolved rather than staying on indefinitely.",
    timingInfo:"BPC-157 is often dosed more frequently (daily or even 2×/day) than TB-500 (commonly 2-3×/week), reflecting their different reported half-lives — track them as separate compounds with separate schedules, not one combined dose.",
    stacks:["Sometimes extended to a 3-compound version adding GHK-Cu for skin/tissue support — see GLOW, or a 4-compound version — see KLOW, which are separate entries in this library."],
    safety:"Both are unapproved research compounds with limited human safety data. Track injection-site reactions per compound and per site — since they're often injected close together, site-reaction attribution between the two can get genuinely ambiguous, which is exactly the kind of thing worth watching in Journal/Insights." },

  { name:"Deadpool", sub:"BPC-157 + TB-500 + Cartalax", color:"#FF9CC8", tags:["Recovery","Injury","Joint","Blend"], evidence:"investigational", blend:["TB-500","BPC-157","Cartalax"],
    benefits:["Wolverine Blend's tissue-repair base (BPC-157 + TB-500) plus Cartalax specifically for cartilage/joint support","Reported broader recovery coverage than Wolverine alone when joint/cartilage wear is part of the picture","Commonly used for injuries involving both soft tissue and joint cartilage together"],
    overview:"A three-compound recovery blend — Wolverine Blend's BPC-157 + TB-500 base with Cartalax added specifically for cartilage/connective tissue support. Less widely documented than Wolverine/GLOW/KLOW, and composition varies more by supplier since Cartalax itself is a less commonly stocked compound.",
    mechanism:"BPC-157 and TB-500 contribute the same tissue-repair/anti-inflammatory action described under Wolverine Blend. Cartalax adds a cartilage-tissue-targeted bioregulator mechanism (see its own entry) rather than another general-inflammation or angiogenesis pathway — the rationale for adding it here is targeting joint/cartilage wear specifically, not duplicating what BPC-157/TB-500 already cover.",
    meta:{ dose:"BPC 10mg + TB-500 10mg + Cartalax 10mg per vial (typical, varies by supplier)", freq:"Varies by compound — often dosed as one combined injection from the vial", route:"SubQ, often near injury/joint site", storage:"Reconstituted: 2–8 °C", cycle:"Often 4-8 wks, similar to Wolverine" },
    cycleInfo:"Similar course-based pattern to Wolverine Blend — commonly run for the duration of a specific injury/joint issue rather than continuously.",
    timingInfo:"No strong distinct timing pattern beyond what applies to the individual compounds — consistency matters more than time of day.",
    stacks:["A joint-focused extension of Wolverine Blend — see that entry for the BPC-157/TB-500 base this builds on."],
    safety:"Same considerations as Wolverine Blend, plus Cartalax's much thinner independent safety data — this is the least-studied component of the three. Confirm your supplier's actual per-compound concentrations before logging doses; named blends like this vary more between vendors than single-compound products." },


  { name:"Retatrutide", sub:"Triple GIP / GLP-1 / Glucagon agonist", color:"#7DF9C0", tags:["Metabolic","Fat Loss","Rx"], evidence:"established",
    benefits:["Reported to produce the largest average weight reduction seen in an injectable to date in Phase 2 data","Triple-receptor action may improve glucose handling alongside appetite suppression","Glucagon-receptor component reported to raise energy expenditure, not just cut intake","Weekly dosing schedule simplifies long-term adherence compared to daily options"],
    overview:"A triple-receptor agonist (GIP, GLP-1, glucagon) developed for obesity and metabolic disease. Phase 2 trials reported some of the largest weight reductions seen for an injectable to date. Still investigational — not yet FDA-approved — so it sits as high-promise, late-stage clinical, not a finished consumer drug.",
    mechanism:"Hits three incretin/metabolic receptors at once: GLP-1 and GIP curb appetite and improve glucose handling, while glucagon agonism raises energy expenditure. The glucagon arm is what differentiates it from semaglutide/tirzepatide.",
    meta:{ dose:"2 mg start → 12 mg maintenance", freq:"1× weekly", route:"SubQ", halfLife:"~6 days", storage:"Reconstituted: 2–8 °C, ~30 days", cycle:"Continuous, titrated" },
    timeline:[["Wk 1–4","Starting dose (~2 mg). Appetite changes begin; GI adjustment."],["Wk 5–12","Titration (4 → 6 → 9 mg). Significant appetite reduction."],["Wk 12–16","Approaching maintenance. Weight loss accelerates."],["Wk 16+","Maintenance (~12 mg). Sustained loss; monitor labs."]],
    cycleInfo:"Continuous — no defined off period. Titrate up over months under clinician guidance; effects sustain with ongoing use. If stopping, weight typically rebounds.",
    timingInfo:"Any time of day — no food or circadian restriction. Consistent weekly day preferred (e.g. always Sunday). Inject fasted or fed equally effective.",
    stacks:["CJC-1295 no DAC + Ipamorelin","Cagrilintide"],
    titration:{
      why:"GI side effects (nausea, constipation, reflux) are dose-dependent and worst during increases. Slow titration lets the gut adapt. Most people find a comfortable maintenance dose rather than pushing to the maximum.",
      stages:[
        {label:"Introductory",dose:"~0.5–1mg",duration:"Weeks 1–4",note:"Tolerance and sensitivity check. Expect little weight effect — this is adaptation, not failure."},
        {label:"Early Escalation",dose:"~1–2mg",duration:"Weeks 4–12",note:"Appetite suppression becomes noticeable. GI symptoms peak here for most people."},
        {label:"Mid Escalation",dose:"~2–4mg",duration:"Weeks 8–16",note:"Significant suppression. Weight loss typically accelerates. Many find their working dose in this range."},
        {label:"Maintenance",dose:"~4–12mg",duration:"Weeks 12+",note:"Clinician-guided. Some stay at mid-range; others titrate higher depending on response and tolerance."},
      ],
      holdReasons:["Persistent nausea lasting more than 2 weeks at current dose","Constipation not managed by fibre/hydration","Heart rate notably elevated","Unable to maintain adequate nutrition","Clinician advises pause"],
      increaseReasons:["Appetite suppression fading earlier in the week (trough symptoms)","Weight plateau despite adherence","Good tolerance at current dose for 4+ weeks"],
      monitor:["Weekly weight trend","Trough symptoms (days 5–7 of cycle)","GI comfort","Heart rate","Food noise timing"],
    },
    safety:"GI effects (nausea, constipation) are the most common, usually worst during dose increases. As a glucagon agonist it can nudge heart rate and glucose dynamics — relevant if you have cardiac or metabolic conditions. Not for use in pregnancy. Because it's investigational, long-term safety is still being characterized. A prescriber should be involved." },

  { name:"Tirzepatide", sub:"Dual GIP / GLP-1 agonist", color:"#7DD4F9", tags:["Metabolic","Fat Loss","Rx"], evidence:"established",
    benefits:["FDA-approved for weight management and type 2 diabetes (Zepbound/Mounjaro)","Dual GIP/GLP-1 action associated with substantial appetite reduction","Reported improvements in blood glucose control and insulin sensitivity","Large clinical trial base compared to most compounds in this library"],
    overview:"A dual GIP/GLP-1 agonist, FDA-approved for type 2 diabetes (Mounjaro) and weight management (Zepbound). One of the most robustly studied metabolic agents available, with large phase 3 weight-loss and glycemic trials behind it.",
    mechanism:"Activates both GIP and GLP-1 receptors — suppressing appetite, slowing gastric emptying, and improving insulin sensitivity. The dual action outperforms GLP-1-only agents like semaglutide in head-to-head trials.",
    meta:{ dose:"2.5 mg start → up to 15 mg", freq:"1× weekly", route:"SubQ", halfLife:"~5 days", storage:"Refrigerated; pens stable per label", cycle:"Continuous, titrated" },
    timeline:[["Wk 1–4","2.5 mg — tolerance phase, not an efficacy test."],["Wk 5–20","Step up every 4 wks as tolerated (5 → 7.5 → 10 mg)."],["Wk 20+","Maintenance (10–15 mg). Steady appetite control."],["Off","Taper rather than stop cold to limit rebound appetite."]],
    stacks:["CJC-1295 no DAC + Ipamorelin"],
    titration:{
      why:"Standard label titration: every 4 weeks as tolerated. Faster escalation increases GI side effects significantly. Most people find a comfortable working dose well below the 15mg maximum.",
      stages:[
        {label:"Introductory",dose:"2.5mg",duration:"Weeks 1–4",note:"Tolerance step — not a therapeutic dose. GI adaptation happens here."},
        {label:"Early Escalation",dose:"5mg",duration:"Weeks 5–8",note:"First active dose. Appetite suppression becomes noticeable."},
        {label:"Mid Escalation",dose:"7.5–10mg",duration:"Weeks 9–20",note:"Most people find their working dose here. Significant weight effect."},
        {label:"Maintenance",dose:"10–15mg",duration:"Week 20+",note:"Clinician-guided. Not everyone needs 15mg; response often plateaus before maximum."},
      ],
      holdReasons:["GI symptoms not resolved from prior step","Unable to tolerate nausea","Clinician advises pause","Labs pending"],
      increaseReasons:["4+ weeks at current dose with good tolerance","Appetite suppression fading","Weight plateau"],
      monitor:["Weekly weight","GI symptoms (nausea, diarrhea)","Appetite pattern","Blood glucose if diabetic"],
    },
    cycleInfo:"Continuous — titrate every 4 weeks as tolerated. Discontinuing leads to appetite/weight rebound; taper rather than stop cold if coming off.",
    timingInfo:"Any time of day — no food restriction required. Pick a consistent weekly day. Nausea is worst in the first hours post-injection; evening dosing may help some people sleep through it.",
    safety:"Best-characterized side effects are GI — nausea, diarrhea, constipation — concentrated in titration. Rare but serious flags from the label include pancreatitis risk and a boxed thyroid C-cell tumor warning (from rodent data); contraindicated with personal/family history of medullary thyroid carcinoma or MEN2. Prescription medication — clinician-managed." },

  { name:"Semaglutide", sub:"GLP-1 agonist", color:"#9CC8FF", tags:["Metabolic","Fat Loss","Rx"], evidence:"established",
    benefits:["FDA-approved for weight management and type 2 diabetes (Wegovy/Ozempic)","Extensive real-world and clinical data on appetite suppression and weight loss","Reported cardiovascular risk-reduction benefit in trials for at-risk populations","Once-weekly dosing with the longest track record of the GLP-1 class"],
    overview:"The GLP-1 agonist behind Ozempic and Wegovy — the drug that mainstreamed this class. Extensively studied for diabetes and obesity, with strong cardiovascular outcome data in specific populations.",
    mechanism:"Single GLP-1 receptor agonist: slows gastric emptying, increases satiety, lowers blood glucose. Weekly dosing thanks to a long half-life from albumin binding.",
    meta:{ dose:"0.25 mg start → 2.4 mg", freq:"1× weekly", route:"SubQ", halfLife:"~7 days", storage:"Refrigerated per label", cycle:"Continuous, titrated" },
    timeline:[["Wk 1–4","0.25 mg — purely a tolerance step."],["Wk 5–16","Climb monthly (0.5 → 1.0 → 1.7 mg)."],["Wk 17+","Maintenance up to 2.4 mg."],["Off","Appetite/weight rebound common; taper + lock in habits."]],
    cycleInfo:"Continuous — titrate monthly over ~4 months to reach maintenance. Designed for long-term use; benefits reverse with discontinuation, so the clinical model is indefinite.",
    timingInfo:"Any time of day, any day of week — just keep it consistent (same day weekly). Can be injected with or without food. Rotate abdomen, thigh, and upper arm.",
    stacks:["Cagrilintide"],
    titration:{
      why:"Monthly titration is the label standard. The 0.25mg starting dose is purely a GI adaptation step — it has essentially no weight effect. Rushing increases GI side effects.",
      stages:[
        {label:"Introductory",dose:"0.25mg",duration:"Weeks 1–4",note:"Adaptation only. No efficacy expected here."},
        {label:"Early Escalation",dose:"0.5mg",duration:"Weeks 5–8",note:"First active dose. Mild appetite suppression begins."},
        {label:"Mid Escalation",dose:"1.0–1.7mg",duration:"Weeks 9–16",note:"Significant suppression. Many find comfortable working dose here."},
        {label:"Maintenance",dose:"2.4mg",duration:"Week 17+",note:"Maximum approved dose for weight management. Not all need this level."},
      ],
      holdReasons:["Active GI symptoms","Clinician guidance","Gallbladder symptoms (rapid weight loss risk)"],
      increaseReasons:["Monthly interval passed","Good tolerance","Weight plateau or fading suppression"],
      monitor:["GI symptoms","Weekly weight","Gallbladder symptoms","Blood glucose if relevant"],
    },
    safety:"Same GLP-1-class GI profile, worst during titration. Carries the class thyroid C-cell warning and pancreatitis caution; gallbladder issues can occur with rapid weight loss. Not in pregnancy. Prescription drug — clinician-managed." },

  { name:"Cagrilintide", sub:"Long-acting amylin analog", color:"#F9C87D", tags:["Metabolic","Fat Loss","Emerging"], evidence:"emerging",
    benefits:["Amylin-analog mechanism reported to add satiety on top of GLP-1 effects","Often studied/used alongside semaglutide for additive appetite suppression","Reported to slow gastric emptying, extending fullness after meals"],
    overview:"A long-acting amylin analog studied for weight management, often paired with semaglutide (the combo 'CagriSema'). Promising phase 2 data; still investigational on its own.",
    mechanism:"Mimics amylin, a hormone co-secreted with insulin that promotes satiety and slows gastric emptying through a different pathway than GLP-1 — which is why combining the two adds effect.",
    meta:{ dose:"Trial-dependent (e.g. up to 2.4 mg)", freq:"1× weekly", route:"SubQ", halfLife:"~7–8 days", storage:"Reconstituted: refrigerated", cycle:"Continuous, titrated" },
    timeline:[["Early","Titrate slowly; nausea is dose-dependent."],["Mid","Appetite suppression builds, complements GLP-1."],["Maintenance","Often run alongside semaglutide in trials."],["Note","Solo long-term data is limited."]],
    cycleInfo:"Continuous — titrated slowly. Often run in combination (e.g. with semaglutide) for additive effect. Solo long-term cycle data doesn't exist yet.",
    timingInfo:"Any time of day, consistent weekly day. As with other GLP-1-class agents, no strict food timing required.",
    stacks:["Semaglutide","Retatrutide"],
    safety:"GI effects similar to incretin drugs. As an investigational agent, its standalone long-term safety isn't established. Combination use amplifies appetite suppression — watch that intake doesn't drop too low. Clinician involvement advised." },

  { name:"GHK-Cu", sub:"Copper tripeptide", color:"#C8FF9C", tags:["Skin","Recovery","Longevity"], evidence:"emerging",
    benefits:["Well-studied for skin firmness, collagen support, and wound healing","Reported improvements in skin texture and reduced fine lines with topical/injectable use","Associated with hair density support in some small studies","Copper-peptide antioxidant properties reported to support tissue repair generally"],
    overview:"A naturally-occurring copper-binding tripeptide (glycyl-L-histidyl-L-lysine) studied mostly for skin, wound healing, and hair. Strong topical/cosmetic evidence; systemic injectable use is more anecdotal.",
    mechanism:"Modulates copper delivery and signals tissue remodeling — stimulating collagen, supporting wound repair, and showing antioxidant and regenerative effects in lab and topical studies.",
    meta:{ dose:"1–2 mg injectable; topical separate", freq:"Daily or 5-on/2-off", route:"SubQ (or topical)", halfLife:"Short (~minutes systemically)", storage:"Reconstituted: 2–8 °C, protect from light", cycle:"Run in blocks of weeks" },
    timeline:[["Wk 1–2","No acute 'feel' — effects are cumulative."],["Wk 3–6","Skin tone/texture and recovery changes reported."],["Wk 6+","Hair and collagen benefits build slowly."],["Note","Most robust evidence is topical, not injected."]],
    cycleInfo:"Typically run in 4–8 week blocks with 2–4 week breaks. Most community protocols do 5-on/2-off daily dosing during a block. Continuous use is less common due to unknown long-term effects.",
    timingInfo:"Morning or evening — avoid immediately post-meal (1–2h window ideal). No strong circadian rationale; consistency matters more than exact timing. Protect vial from light.",
    stacks:["BPC-157","CJC-1295 no DAC + Ipamorelin"],
    safety:"Generally well-tolerated; injection-site redness can occur. Systemic injected use is less studied than topical — copper balance is theoretically a consideration with high chronic dosing. Avoid in pregnancy. Effects are gradual, not acute." },

  { name:"BPC-157", sub:"Body Protection Compound", color:"#FF9CC8", tags:["Recovery","Gut","Research"], evidence:"investigational",
    benefits:["One of the most widely researched peptides for gut lining repair","Reported to accelerate healing of tendons, ligaments, and muscle in animal studies","Associated with reduced inflammation at injury and joint sites","Commonly used near a specific injury site alongside systemic dosing"],
    overview:"A synthetic 15-amino-acid peptide derived from a protein found in gastric juice. Heavily used in the recovery community for tendon, gut, and soft-tissue healing. Animal data is striking; human clinical trials are essentially absent.",
    mechanism:"Appears to promote angiogenesis (new blood vessel formation) and modulate growth factors and the nitric oxide system, accelerating tissue repair in animal models. Mechanism in humans is inferred, not proven.",
    meta:{ dose:"200–500 mcg", freq:"1–2× daily or 2–3×/week", route:"SubQ (often near injury)", halfLife:"Short", storage:"Reconstituted: refrigerated", cycle:"4–6 wk blocks during injury" },
    timeline:[["Wk 1–2","Some report early reduction in pain/inflammation."],["Wk 3–4","Soft-tissue recovery improvements (anecdotal)."],["Wk 4–6","Typical block length; reassess and pause."],["Note","No completed human efficacy trials."]],
    cycleInfo:"4–6 week active blocks, then 2–4 week break. Often run at higher frequency (2× daily) during acute injury, dropping to maintenance (1× daily or 3×/week) as recovery progresses.",
    timingInfo:"Best taken fasted or between meals — 30+ min away from food. Morning dosing most common. For joint/tendon targets, injecting near (but not in) the injury site is the community standard.",
    stacks:["TB-500","GHK-Cu"],
    safety:"Widely reported as well-tolerated, but that's community experience, not trial data — true safety is not established in humans. Not approved for human use anywhere and WADA-prohibited. Quality/purity varies hugely by source. Treat as experimental." },

  { name:"TB-500", sub:"Thymosin Beta-4 fragment", color:"#C9A0FF", tags:["Recovery","Research"], evidence:"investigational",
    benefits:["Reported to support cell migration and tissue repair via actin regulation","Associated with reduced inflammation and improved flexibility around injuries","Often paired with BPC-157 for combined systemic + local recovery support"],
    overview:"A synthetic version of a region of thymosin beta-4, used in the recovery community for soft-tissue and injury healing, often alongside BPC-157. Animal and in-vitro data only; no human efficacy trials.",
    mechanism:"Thymosin beta-4 regulates actin, a cell-building protein involved in cell migration and tissue repair — theorized to aid healing and reduce inflammation. Human relevance is extrapolated from lab models.",
    meta:{ dose:"2–5 mg (loading), then lower", freq:"1–2×/week", route:"SubQ", halfLife:"Long-ish", storage:"Reconstituted: refrigerated", cycle:"Loading phase then maintenance, in blocks" },
    timeline:[["Loading","Higher frequency for the first few weeks."],["Maintenance","Drop to weekly once 'loaded' (community protocol)."],["Block end","Pause and reassess; no validated long-term regimen."],["Note","Frequently stacked with BPC-157."]],
    cycleInfo:"Loading phase: 2–5 mg, 2×/week for 4–6 weeks. Maintenance: 2–5 mg, 1×/week for 4–6 weeks. Then pause 4–8 weeks. Most run it alongside BPC-157 for the same injury block.",
    timingInfo:"No specific circadian requirement — any time of day. SubQ near the injury or in the abdomen. Loading protocol front-loads frequency, not dose size.",
    stacks:["BPC-157"],
    safety:"Community-tolerated but unstudied in humans for these uses. Not approved for human use and WADA-prohibited. Theoretical concern about promoting growth in any existing abnormal tissue. Source purity is a real variable. Experimental." },

  { name:"HGH", sub:"Recombinant human growth hormone (Somatropin)", color:"#FFB84D", tags:["GH","Recovery","Rx"], evidence:"established",
    benefits:["Reported effects on lean mass, fat loss, and recovery at physiological/therapeutic doses","Most extensively studied growth-hormone intervention, including long-term human safety data","Associated with improved skin thickness and connective tissue quality","Prescription-only in most jurisdictions — higher regulatory oversight than most peptides here"],
    overview:"Recombinant human growth hormone — the actual hormone itself, not a secretagogue. FDA-approved for GH deficiency and a handful of other diagnoses; used off-label for body composition, recovery, and anti-aging. Unlike CJC-1295/Ipamorelin, which nudge your pituitary to release more of your own GH, HGH directly raises circulating GH (and downstream IGF-1) regardless of your natural pulses.",
    mechanism:"Binds GH receptors directly across tissue, driving IGF-1 production in the liver and periphery. This bypasses the body's own pulsatile release and negative-feedback loop, which is the core mechanistic difference from GHRH analogs and GH secretagogues — more direct, but also less physiological.",
    meta:{ dose:"~1–4 IU/day (context-dependent)", freq:"Daily, often 5-on/2-off", route:"SubQ", halfLife:"~2–3 hours (IGF-1 effects last longer)", storage:"Refrigerated after reconstitution", cycle:"Weeks to months, clinician-guided" },
    timeline:[["Wk 1–2","Water retention, mild joint achiness as the body adjusts."],["Wk 4–8","Sleep and recovery changes more noticeable; body-composition shifts begin."],["Wk 8–16","Slower-building changes in lean mass and fat distribution."],["Ongoing","Effects reverse over weeks to months if discontinued."]],
    cycleInfo:"Often run continuously or 5-days-on/2-off at clinician-set doses. Longer-term than most secretagogue cycles since the effect builds gradually and doesn't rely on preserving pituitary responsiveness the way GHRH analogs do.",
    timingInfo:"Typically evening dosing, mirroring the body's natural largest GH pulse during early sleep. SubQ, site rotation recommended.",
    stacks:["CJC-1295 no DAC + Ipamorelin"],
    safety:"Directly overrides natural feedback regulation — meaningfully different risk profile than secretagogues. Can affect insulin sensitivity/glucose (monitor if diabetic or prediabetic), cause fluid retention, carpal-tunnel-type symptoms, and joint pain, especially early. Contraindicated with active malignancy given IGF-1's growth-signaling role. Prescription-only; prescribed off-label use should be clinician-supervised, ideally with bloodwork (IGF-1, glucose) monitoring." },

  { name:"CJC-1295 no DAC", sub:"GHRH analog (Mod GRF 1-29)", color:"#7DF9C0", tags:["GH","Recovery","Sleep"], evidence:"investigational",
    benefits:["Shorter-acting GHRH analog reported to produce a natural GH pulse shape","Often preferred over the DAC version for tighter control over timing/dosing frequency","Reported recovery and sleep-quality benefits similar to other GH secretagogues"],
    overview:"A short-acting growth-hormone-releasing hormone analog (also called Mod GRF 1-29), almost always paired with Ipamorelin. Used to support natural GH pulses for recovery, sleep, and body composition.",
    mechanism:"Stimulates the pituitary to release growth hormone in a natural pulsatile pattern. 'No DAC' means short-acting — it mimics a physiological pulse rather than a sustained elevation, which is why it's dosed frequently and timed to sleep.",
    meta:{ dose:"100–300 mcg", freq:"1–3× daily (often bedtime)", route:"SubQ", halfLife:"~30 min", storage:"Reconstituted: 2–8 °C", cycle:"8–12 wk on, break" },
    timeline:[["Wk 1–4","Sleep quality improvements often reported first."],["Wk 4–8","Recovery and body-composition changes build."],["Wk 8–12","Typical cycle length before a break."],["Note","Pulsatile dosing; empty stomach around injection."]],
    cycleInfo:"8–12 weeks on, 4–6 weeks off. The off period lets the GH axis reset and avoids receptor desensitization. Many run 2–3 cycles per year.",
    timingInfo:"Bedtime is strongly preferred — GH naturally pulses during sleep. Inject 30+ min after last meal (fasted stomach blunts the GH pulse). If dosing multiple times daily, spread doses at least 3–4h apart.",
    stacks:["Ipamorelin","CJC-1295 no DAC + Ipamorelin"],
    safety:"Reported side effects include injection-site reactions, water retention, tingling, and head-rush. GH-axis stimulation has theoretical implications for insulin sensitivity and any existing growths. Not approved for human use; WADA-prohibited. Clinician input wise, especially with metabolic conditions." },

  { name:"Ipamorelin", sub:"Selective GH secretagogue", color:"#9CDC5C", tags:["GH","Recovery","Sleep"], evidence:"investigational",
    benefits:["Considered one of the mildest GH secretagogues — minimal cortisol/appetite impact reported","Reported improvements in sleep quality and recovery","Often chosen specifically to avoid the hunger spike seen with older GHRPs"],
    overview:"A selective growth hormone secretagogue (ghrelin-receptor agonist) prized for stimulating GH with minimal effect on cortisol or appetite — which is why it's the go-to partner for CJC-1295.",
    mechanism:"Activates the ghrelin/GH-secretagogue receptor to trigger a clean GH pulse from the pituitary, without the cortisol and prolactin bumps that older secretagogues caused.",
    meta:{ dose:"100–300 mcg", freq:"1–3× daily", route:"SubQ", halfLife:"~2 hours", storage:"Reconstituted: 2–8 °C", cycle:"8–12 wk on, break" },
    timeline:[["Wk 1–4","Sleep and recovery first; subtle at low doses."],["Wk 4–8","Body-composition support builds with consistency."],["Wk 8–12","Cycle length before a planned break."],["Note","Synergistic with a GHRH like CJC-1295."]],
    cycleInfo:"8–12 weeks on, 4–6 weeks off. Almost always run alongside CJC-1295 no DAC for synergy — the GHRH + GHS combination produces a stronger pulse than either alone.",
    timingInfo:"Bedtime preferred — align with natural GH pulses during sleep. Fasted stomach required for a clean GH pulse (no food for 2h prior). Can dose pre-workout as a second injection for recovery support.",
    stacks:["CJC-1295 no DAC","CJC-1295 no DAC + Ipamorelin"],
    safety:"Considered one of the cleaner secretagogues, but still unapproved for human use and WADA-prohibited. Possible head-rush, water retention, injection-site reactions. GH-axis cautions around insulin sensitivity apply. Experimental." },

  { name:"Tesamorelin", sub:"GHRH analog", color:"#F9C87D", tags:["GH","Metabolic","Rx"], evidence:"established",
    benefits:["FDA-approved specifically for reducing visceral fat in a defined clinical population","Reported fat-loss effects concentrated in abdominal/visceral fat specifically","More clinical trial data than most GH-secretagogues in this library"],
    overview:"A stabilized GHRH analog, FDA-approved specifically to reduce visceral (deep abdominal) fat in HIV-associated lipodystrophy. The most clinically-validated GH-axis peptide here.",
    mechanism:"Stimulates endogenous GH release like other GHRH analogs, but with proven, targeted reduction of visceral adipose tissue in its approved population. Off-label interest centers on that visceral-fat effect.",
    meta:{ dose:"~1–2 mg", freq:"Daily", route:"SubQ", halfLife:"Short", storage:"Refrigerated per label", cycle:"Continuous in approved use" },
    timeline:[["Wk 1–4","Onset is gradual; no acute effect."],["Wk 8–12","Visceral fat reduction measurable in trials."],["Ongoing","Effects reverse if discontinued."],["Note","Strongest GH-peptide evidence base."]],
    cycleInfo:"Continuous in approved (clinical) use — designed for ongoing administration. Off-label cycles often mirror other GHRH protocols (8–12 weeks on, break).",
    timingInfo:"Evening / bedtime preferred — mirrors physiological GH release. Inject SubQ in the abdomen. Fasted dosing preferred (no food 2h before).",
    stacks:["Ipamorelin"],
    safety:"As an approved drug it has the clearest profile here: injection-site reactions, joint/muscle aches, and GH-axis effects on glucose. Same insulin-sensitivity and abnormal-growth cautions as other GH stimulators. Prescription — clinician-managed." },

  { name:"MOTS-c", sub:"Mitochondrial-derived peptide", color:"#7DD4F9", tags:["Metabolic","Longevity","Performance"], evidence:"investigational",
    benefits:["Researched for metabolic effects including improved insulin sensitivity","Reported support for exercise capacity and mitochondrial function","Associated with fat metabolism support, particularly with exercise"],
    overview:"A small peptide encoded by mitochondrial DNA. In humans it rises with exercise; in animal studies, injected MOTS-c improves insulin sensitivity and metabolic flexibility. The key translational step — completed human therapeutic trials of injected MOTS-c — is missing. High-interest, low-certainty.",
    mechanism:"Best-supported mechanism is AMPK-linked metabolic-stress signaling, with downstream effects on glucose handling and lipid oxidation — conceptually metformin-like, but far more speculative and less validated.",
    meta:{ dose:"~5–10 mg/week (community)", freq:"1–2×/week", route:"SubQ", halfLife:"Not established in humans", storage:"Lyophilized: 4 °C short / frozen long", cycle:"~20 days active then break (community)" },
    timeline:[["Wk 1–2","Treat as a tolerance check, not efficacy."],["Wk 3–4","Look for subtle energy/recovery changes (anecdotal)."],["Wk 5–8","Reassess whether there's any measurable signal."],["After","Pause; no validated long-term native regimen."]],
    cycleInfo:"Community protocol: ~20 days on, then a break of equal or longer duration. Some do shorter blocks (10–14 days). Long-term continuous use is not validated and not advisable given the unknown safety profile.",
    timingInfo:"Morning before exercise is the most cited window — MOTS-c levels naturally rise with physical activity. Fasted or light pre-workout state. Avoid late evening (possible sleep disruption reported by some).",
    stacks:["NAD+","CJC-1295 no DAC + Ipamorelin"],
    safety:"True therapeutic safety is NOT established — limited human exposure data. Anecdotal reports of injection-site irritation, insomnia, and palpitations. Possible interaction with other AMPK-active drugs like metformin. WADA-prohibited. Avoid in pregnancy and active malignancy. Genuinely experimental." },

  { name:"5-Amino-1MQ", sub:"NNMT inhibitor (small molecule)", color:"#FF9CC8", tags:["Metabolic","Body Comp"], evidence:"investigational",
    benefits:["Researched for fat cell metabolism via NNMT enzyme inhibition","Reported support for metabolic rate and body composition changes","Oral compound — no injection required, unlike most entries in this library"],
    overview:"A small-molecule NNMT (nicotinamide N-methyltransferase) inhibitor explored for metabolism and body composition. Mostly oral in community use. Preclinical interest; human clinical data is minimal.",
    mechanism:"Inhibiting NNMT is theorized to raise cellular NAD+ and shift fat-cell metabolism toward energy expenditure — animal data suggests reduced fat mass without appetite suppression.",
    meta:{ dose:"50–150 mg/day (community, oral)", freq:"Daily", route:"Oral (injectable variants exist)", halfLife:"Not well characterized", storage:"Per formulation", cycle:"Run in blocks" },
    timeline:[["Wk 1–4","Subtle; not an appetite suppressant."],["Wk 4–8","Body-composition shifts reported anecdotally."],["Reassess","Limited data to guide duration."],["Note","Not a peptide — a small molecule."]],
    cycleInfo:"Run in 4–8 week blocks with breaks; no validated protocol. Community typically mirrors other metabolic compound cycles.",
    timingInfo:"Usually taken in the morning — aligns with metabolic/energy rationale. Oral (most community use); food timing not well-characterized.",
    stacks:["MOTS-c","NAD+"],
    safety:"Human safety data is sparse. Not an approved drug. Because it manipulates NAD+ metabolism, interactions with other NAD-affecting compounds are plausible. Quality varies by source. Experimental — clinician input wise." },

  { name:"NAD+", sub:"Coenzyme (cellular energy)", color:"#9CC8FF", tags:["Longevity","Energy","Recovery"], evidence:"emerging",
    benefits:["Reported improvements in cellular energy production and mental clarity","Associated with reduced fatigue and improved recovery in anecdotal reports","Researched for cognitive support and healthy aging pathways","Popular for hangover/jet-lag recovery protocols, though evidence here is largely anecdotal"],
    overview:"Nicotinamide adenine dinucleotide — a coenzyme central to cellular energy and DNA repair that declines with age. Injected/IV NAD+ is popular in longevity circles; rigorous human outcome data is still building.",
    mechanism:"NAD+ is a required cofactor for mitochondrial energy production and for sirtuins and PARPs involved in repair and aging pathways. Restoring levels is the longevity thesis — clinical proof of meaningful outcomes is still emerging.",
    meta:{ dose:"Varies widely (mg–hundreds)", freq:"Several×/week or IV", route:"SubQ or IV", halfLife:"Short", storage:"Refrigerated", cycle:"Ongoing or in blocks" },
    timeline:[["Acute","SubQ/IV can cause flushing or chest tightness if pushed fast."],["Weeks","Energy/clarity benefits reported anecdotally."],["Ongoing","Longevity rationale is long-horizon."],["Note","Go slow — infusion rate drives side effects."]],
    cycleInfo:"Often run continuously at lower doses (2–3×/week SubQ) or as periodic IV loading sessions (e.g. monthly). No defined off-cycle for the longevity use case.",
    timingInfo:"Morning or early afternoon — some report stimulating energy effects that can interfere with sleep if dosed late. IV: go very slow on the drip rate to avoid flushing and chest tightness.",
    stacks:["MOTS-c","5-Amino-1MQ"],
    safety:"The notable acute issue is dose/rate-dependent flushing, nausea, and chest tightness — going slow mitigates it. Long-term outcome evidence in humans is limited. Precursors (NMN/NR) are an oral alternative with their own evidence debate. Reasonable to involve a clinician." },

  { name:"Sermorelin", sub:"GHRH analog", color:"#7DF9C0", tags:["GH","Sleep","Anti-aging"], evidence:"emerging",
    benefits:["Reported to support natural growth hormone release, especially in older adults","Associated with improved sleep quality and recovery","Shorter track record and shorter half-life than CJC-1295, requiring more frequent dosing"],
    overview:"One of the older GHRH analogs, historically used (and once FDA-approved) for growth-hormone testing and pediatric GH deficiency. Popular in anti-aging clinics for gently supporting natural GH.",
    mechanism:"Stimulates pituitary GH release like other GHRH analogs, but shorter-acting than CJC-1295. The appeal is a physiological, pulsatile nudge rather than exogenous GH.",
    meta:{ dose:"100–300 mcg", freq:"Daily (often bedtime)", route:"SubQ", halfLife:"~10–20 min", storage:"Reconstituted: 2–8 °C", cycle:"Ongoing or 3-month blocks" },
    timeline:[["Wk 1–4","Sleep quality often the first reported change."],["Wk 4–12","Recovery and body-composition effects build slowly."],["Ongoing","Clinic protocols often run multi-month."],["Note","Gentler/shorter-acting than CJC-1295."]],
    cycleInfo:"Often run in 3–6 month blocks (especially in clinic settings), then reassess. Shorter cycles (8–12 weeks) are also common. Annual use with breaks is the typical long-term pattern.",
    timingInfo:"Bedtime is the standard — aligns with natural GH release during deep sleep. Fasted injection preferred (2h post-meal). Bedtime routine makes compliance easier for daily dosing.",
    stacks:["Ipamorelin"],
    safety:"Has a longer human track record than most peptides here. Possible injection-site reactions, flushing, head-rush. Standard GH-axis cautions (glucose, abnormal growths). Often clinic-prescribed; clinician involvement is the norm." },

  { name:"Melanotan II", sub:"Melanocortin agonist", color:"#F9C87D", tags:["Tanning","Libido","Research"], evidence:"investigational",
    benefits:["Reported to increase skin melanin production (tanning effect) without UV exposure","Associated with appetite suppression as a secondary effect","Reported libido-enhancing effects, which led to the separate PT-141 spinoff"],
    overview:"A synthetic melanocortin agonist used recreationally for tanning and libido effects. Notably different risk profile from the metabolic/recovery peptides — more side-effect-prone and entirely unregulated for these uses.",
    mechanism:"Activates melanocortin receptors, stimulating melanin production (darker skin) and influencing sexual-arousal pathways. The same receptor activity drives many of its side effects.",
    meta:{ dose:"Low (e.g. 250–500 mcg)", freq:"Variable / as-needed", route:"SubQ", halfLife:"Short", storage:"Reconstituted: refrigerated", cycle:"As needed (caution)" },
    timeline:[["Early","Nausea and facial flushing common at first doses."],["Weeks","Skin darkening develops with UV exposure."],["Caution","Existing moles can darken/change — monitor."],["Note","Higher nuisance-side-effect rate than most."]],
    cycleInfo:"No standard protocol — typically used in short loading blocks (daily for 1–2 weeks) to achieve tanning effect, then as-needed maintenance. Prolonged continuous use not recommended.",
    timingInfo:"Evening often preferred to sleep through initial nausea and flushing. Low starting dose (0.1–0.25 mg) until tolerance is established.",
    stacks:[],
    safety:"More side-effect-prone than the metabolic peptides: nausea, flushing, spontaneous erections, and darkening of moles/freckles — the last is a real concern because changes in pigmented lesions can mask or mimic melanoma. Not approved; unregulated. Dermatologist monitoring is genuinely sensible if used. Avoid in pregnancy." },

  { name:"Glutathione", sub:"Master antioxidant tripeptide", color:"#C8FF9C", tags:["Antioxidant","Detox","Skin"], evidence:"emerging",
    benefits:["The body's master antioxidant — supports cellular detoxification pathways","Reported improvements in skin brightness and clarity","Associated with reduced oxidative stress and improved energy in some users","Often used alongside other protocols as general antioxidant support"],
    overview:"A tripeptide (glutamate-cysteine-glycine) that's the body's primary endogenous antioxidant, central to detoxification and cellular redox balance. Injected/IV glutathione is popular for skin brightening, recovery, and 'detox' support; oral forms are poorly absorbed, which is why injectable interest exists.",
    mechanism:"Neutralizes free radicals and supports phase-II liver detoxification by donating electrons via its cysteine thiol group. Also recycles other antioxidants (vitamins C and E). Levels fall with age, stress, and illness.",
    meta:{ dose:"100–600 mg (varies widely)", freq:"1–3×/week or IV", route:"SubQ, IM, or IV", halfLife:"Short", storage:"Reconstituted: 2–8 °C, protect from light", cycle:"Ongoing or in blocks" },
    timeline:[["Acute","No dramatic 'feel'; some report clarity/energy."],["Wk 2–4","Skin tone/brightening effects reported (anecdotal)."],["Ongoing","Antioxidant support is a long-horizon rationale."],["Note","Very light-sensitive — keep vials dark."]],
    cycleInfo:"Flexible — many run 2–3×/week SubQ as ongoing maintenance, or do periodic IV loading sessions. No defined off-cycle for antioxidant support. Light-sensitive — short shelf life once reconstituted.",
    timingInfo:"Any time of day. Morning or post-workout are common choices. Space 30+ min from other injectables. Protect vial from light at all times — even brief UV exposure degrades it.",
    stacks:["NAD+","Vitamin C (co-administered in some IV protocols)"],
    safety:"Generally well-tolerated; injection-site reactions and rare hypersensitivity possible. The skin-lightening effect (reduced melanin) is cosmetic, not a health benefit, and high-dose chronic use is under-studied. IV administration carries the usual infusion risks and should be clinically supervised. Quality and sterility matter especially for IV." },

  { name:"Epithalon", sub:"Telomerase-activating tetrapeptide", color:"#C9A0FF", tags:["Longevity","Sleep","Research"], evidence:"investigational",
    benefits:["Researched for telomerase activation and cellular aging pathways","Reported improvements in sleep quality and circadian rhythm regulation","Studied longitudinally in some Russian aging research, though data is limited outside that body of work"],
    overview:"A synthetic tetrapeptide (a fragment of the pineal peptide epitalamin) studied — mostly by a single Russian research group — for longevity, telomere maintenance, and sleep/circadian effects. Intriguing animal and small-human data, but far from independently validated.",
    mechanism:"Reported to stimulate telomerase (the enzyme that maintains chromosome end-caps) and to support pineal/melatonin regulation. The telomere-lengthening claim is the headline and also the least independently replicated.",
    meta:{ dose:"5–10 mg", freq:"Daily during a short course", route:"SubQ", halfLife:"Short", storage:"Reconstituted: 2–8 °C", cycle:"~10–20 day courses, 1–2×/year" },
    timeline:[["Course start","Run daily for a short defined block."],["During","Sleep quality improvements most commonly reported."],["After","Typically paused for months before repeating."],["Note","Longevity claims are not independently confirmed."]],
    cycleInfo:"Short intensive courses: 10–20 daily injections, 1–2 times per year. Not run continuously — the protocol is specifically course-based with long gaps between. The short-course model is central to the longevity rationale.",
    timingInfo:"Evening preferred by most — DSIP-like sleep/circadian effects are part of the appeal. Consistent daily timing for the duration of the course.",
    stacks:["MOTS-c","NAD+"],
    safety:"Human safety data is limited and largely from one research lineage. Telomerase activation is theoretically double-edged — the same mechanism is relevant to cancer biology — so caution with any cancer history is warranted. Not approved for human use. Treat longevity claims skeptically; this is experimental." },

  { name:"Cartalax", sub:"Cartilage-targeting dipeptide bioregulator", color:"#9CC8FF", tags:["Joint","Cartilage","Recovery","Research"], evidence:"investigational",
    benefits:["Researched for cartilage tissue support and joint comfort","Reported improvements in joint mobility and reduced stiffness","Part of the same Khavinson bioregulator peptide family as Epithalon, targeted at connective tissue instead of the pineal gland"],
    overview:"A short synthetic dipeptide (Ala-Glu) from the same Khavinson bioregulator research lineage as Epithalon — this one is targeted at cartilage and connective tissue rather than sleep/longevity. Much less commonly discussed than the joint-recovery peptides (BPC-157, TB-500) it's often stacked alongside, with a smaller body of available research.",
    mechanism:"Proposed to act as a tissue-specific bioregulator, supporting normal gene expression and protein synthesis in cartilage/connective tissue cells — the same general bioregulator theory behind Epithalon, applied to a different target tissue. Mechanistic detail here is thinner than for better-studied joint peptides.",
    meta:{ dose:"~10 mg (varies by supplier)", freq:"Daily during a short course", route:"SubQ", halfLife:"Short", storage:"Reconstituted: 2–8 °C", cycle:"Short defined courses, similar to Epithalon" },
    cycleInfo:"Following the Khavinson bioregulator pattern, typically run as a short daily course (commonly 10-20 days) rather than continuously, with breaks between courses.",
    timingInfo:"No strong reported time-of-day preference — consistency of daily timing during the course matters more than the specific time chosen.",
    stacks:["BPC-157","TB-500","GHK-Cu — see Deadpool, a named blend combining this with BPC-157 and TB-500"],
    safety:"Very limited independent human safety data outside the original bioregulator research lineage — treat with the same caution as Epithalon. Not approved for human use." },

  { name:"KPV", sub:"Alpha-MSH tripeptide fragment", color:"#FF9CC8", tags:["Anti-inflammatory","Gut","Skin","Research"], evidence:"investigational",
    benefits:["Reported anti-inflammatory effects, particularly in gut tissue","Associated with skin healing and reduced inflammatory skin reactions","Derived from the same precursor as Melanotan II, without the pigmentation effect"],
    overview:"KPV (Lys-Pro-Val) is the C-terminal tripeptide fragment of alpha-melanocyte stimulating hormone (α-MSH). It carries the anti-inflammatory signaling properties of the full peptide — without the tanning, libido, or melanocortin side effects that come with longer fragments like Melanotan II. Used in the community primarily for gut inflammation, skin conditions, and systemic anti-inflammatory support.",
    mechanism:"Binds melanocortin receptors (particularly MC1R and MC3R) to suppress NF-κB signaling and pro-inflammatory cytokines (IL-1β, TNF-α, IL-6). Also appears to directly interact with immune cells in the gut mucosa — which is why oral delivery has local gut efficacy without requiring systemic absorption. Systemic SubQ use produces broader anti-inflammatory effects.",
    meta:{ dose:"250–750 mcg/day", freq:"Daily or 2× daily", route:"SubQ or oral", halfLife:"Very short (~2h)", storage:"Reconstituted: 2–8 °C, protect from light", cycle:"4–8 week blocks" },
    cycleInfo:"4–8 week active blocks with 2–4 week breaks. Daily dosing is standard; twice-daily for acute gut flares. Continuous use is not typical — the anti-inflammatory effect doesn't require constant presence once the cycle has done its work.",
    timingInfo:"Flexible — no strong circadian rationale. For gut use: between meals or 30 min before eating. For skin/systemic: any time of day. Oral capsule form is taken with water away from food. SubQ near skin target for localized use is a common approach.",
    timeline:[["Wk 1–2","No dramatic acute effect. Gut comfort and reduced bloating are usually the first signals."],["Wk 2–4","Skin redness/acne reduction and improved texture reported; anti-inflammatory effects accumulate."],["Wk 4–8","Full block; reassess symptoms and decide whether to continue or pause."],["Note","Effects are subtle and cumulative — track daily to find your signal."]],
    stacks:["BPC-157","GHK-Cu","Glutathione"],
    safety:"Well-tolerated in animal models with a clean safety profile given its short sequence. Human data is limited and largely anecdotal. Because it hits melanocortin receptors, theoretical interaction with melanin/tanning is possible at high doses but rarely reported at typical community doses. Oral form avoids injection risks for gut-specific use. Not approved; experimental. Clinician involvement advisable for chronic inflammatory conditions." },

  { name:"GLOW", sub:"GHK-Cu + BPC-157 + TB-500 blend", color:"#C8FF9C", tags:["Skin","Recovery","Blend","Research"], evidence:"investigational", blend:["GHK-Cu","BPC-157","TB-500"],
    benefits:["Three-compound blend (BPC-157 + TB-500 + GHK-Cu) combining recovery and skin support","Reported faster tissue repair from the BPC-157/TB-500 pair","Adds skin/collagen support from GHK-Cu on top of the Wolverine blend's recovery focus"],
    overview:"GLOW is a compounded triple-peptide blend combining GHK-Cu (copper tripeptide), BPC-157, and TB-500 in a single vial. Popular in the compounding pharmacy and research community for skin regeneration, tissue repair, and anti-aging applications. Not a single molecule — it's a formulation. Each component has its own independent research history; the combination is designed for multi-pathway synergy.",
    mechanism:"Three complementary mechanisms in one vial: GHK-Cu stimulates collagen and elastin via copper-mediated gene expression; BPC-157 promotes angiogenesis and tissue repair through nitric oxide and VEGF pathways; TB-500 mobilizes actin-binding proteins (thymosin beta-4) to support cell migration and reduce inflammation. Together they target skin structure, vascular support, and cellular repair simultaneously.",
    meta:{ composition:"GHK-Cu (50mg) + BPC-157 (10mg) + TB-500 (10mg)", freq:"1–3× weekly (common protocol)", route:"SubQ", storage:"Reconstituted: 2–8 °C, protect light", cycle:"4–8 week blocks", source:"Compounding pharmacy / research suppliers" },
    cycleInfo:"4–8 week active blocks, 2–4 week breaks. Most protocols run 2–3× per week during the block. Frequency can be daily during an acute skin or injury focus period.",
    timingInfo:"No strong circadian requirement. Morning or evening — consistency matters more than exact timing. Protect from light; GHK-Cu is photosensitive. SubQ in the abdomen is standard; some inject near target areas (e.g. near a scar).",
    timeline:[["Wk 1–2","No immediate visible effect — GHK-Cu and BPC-157 work cumulatively."],["Wk 2–4","Skin texture, tone, and wound healing improvements typically emerge first."],["Wk 4–8","Fuller collagen and recovery benefits. Most protocols reassess at 8 weeks."],["Note","Response is highly individual — log weekly photos and symptom scores."]],
    stacks:["KPV","Glutathione","NAD+"],
    safety:"Each component has its own safety profile — see GHK-Cu, BPC-157, and TB-500 individual entries. The blend amplifies each compound's effects; start conservatively. No RCT data on the combination exists. WADA-prohibited (BPC-157, TB-500). Compounding pharmacy access requires a prescription in most jurisdictions. Experimental for all unlabelled cosmetic/anti-aging uses." },

  { name:"KLOW", sub:"GHK-Cu + KPV + BPC-157 + TB-500 blend", color:"#FF9CC8", tags:["Anti-inflammatory","Skin","Recovery","Blend","Research"], evidence:"investigational", blend:["GHK-Cu","KPV","BPC-157","TB-500"],
    benefits:["Four-compound blend (BPC-157 + TB-500 + GHK-Cu + KPV) for recovery, skin, and inflammation","Combines tissue repair, skin support, and anti-inflammatory effects in one protocol","Reported as a broader-spectrum option than GLOW for users prioritizing gut/inflammation support too"],
    overview:"KLOW is an expanded version of the GLOW blend — it adds KPV (the alpha-MSH anti-inflammatory tripeptide) to the GHK-Cu + BPC-157 + TB-500 base. The addition of KPV extends the formulation's scope from structural remodeling into immune modulation and gut/skin inflammation. Often chosen over GLOW when inflammation — gut, skin, or systemic — is a primary target.",
    mechanism:"All of GLOW's mechanisms (collagen via GHK-Cu, angiogenesis via BPC-157, cell migration via TB-500) plus KPV's NF-κB suppression and cytokine reduction (IL-1β, TNF-α, IL-6). KPV's anti-inflammatory action complements BPC-157's cytoprotective effect, making KLOW particularly relevant for inflammatory gut conditions, acne, rosacea, eczema, and post-inflammatory repair.",
    meta:{ composition:"GHK-Cu (50mg) + KPV (10mg) + BPC-157 (10mg) + TB-500 (10mg)", freq:"1–3× weekly", route:"SubQ or oral (KPV component)", storage:"Reconstituted: 2–8 °C, protect light", cycle:"4–8 week blocks", source:"Compounding pharmacy / research suppliers" },
    cycleInfo:"4–8 week active blocks, 2–4 weeks off. Daily frequency during acute inflammatory flares; 2–3× weekly for maintenance/remodeling cycles. KPV's anti-inflammatory effects are fast enough that daily use during a flare is justified.",
    timingInfo:"Flexible timing — no strict circadian rationale. For gut inflammation focus: between meals or 30 min before eating. For skin/systemic: any time of day. Same light-protection requirements as GLOW (GHK-Cu photosensitivity).",
    timeline:[["Wk 1–2","KPV's anti-inflammatory effect may show faster than the structural components — reduced gut discomfort, skin redness/acne can emerge early."],["Wk 2–4","Skin texture and wound healing improvements from GHK-Cu and BPC-157 build."],["Wk 4–8","Full multi-pathway benefit; assess whether to continue or move to GLOW maintenance."],["Note","If inflammation was the primary driver, KLOW's advantage over GLOW is most visible here."]],
    stacks:["Glutathione","NAD+","Retatrutide (for skin during GLP-1 weight loss)"],
    safety:"Carries all the individual compound safety considerations of GHK-Cu, KPV, BPC-157, and TB-500. WADA-prohibited (BPC-157, TB-500). KPV's melanocortin receptor activity is generally minimal at typical doses but relevant with prolonged high-dose use. No combination RCT data exists. Prescription required for compounding pharmacy sourcing. Experimental." },


  { name:"DSIP", sub:"Delta Sleep-Inducing Peptide", color:"#9CC8FF", tags:["Sleep","Stress","Research"], evidence:"investigational",
    benefits:["Researched for sleep induction and sleep quality improvement","Reported to help with sleep onset without the grogginess of some sedatives","Associated with stress-response modulation in some studies"],
    overview:"A neuropeptide first isolated for its association with delta-wave (deep) sleep. Used in the community for sleep quality and stress resilience. Decades-old discovery but still poorly characterized; human evidence is thin and inconsistent.",
    mechanism:"Proposed to modulate sleep architecture and the stress/HPA axis, possibly influencing delta-wave sleep and stress-hormone regulation. The exact mechanism and even reliable effect size remain unclear.",
    meta:{ dose:"~100–300 mcg", freq:"Evening, as needed", route:"SubQ", halfLife:"Very short", storage:"Reconstituted: 2–8 °C", cycle:"As needed / short blocks" },
    timeline:[["Acute","Taken before bed; effect is subtle and variable."],["Nightly","Some report deeper or more restorative sleep."],["Note","Response is inconsistent person-to-person."],["Caution","Don't combine sedatives without clinician input."]],
    cycleInfo:"As-needed or short blocks (1–2 weeks). Not typically run continuously. Best used situationally for sleep disruption rather than as a daily supplement.",
    timingInfo:"30–60 min before bed is the only timing that makes sense given its purpose. Do not combine with alcohol, sleep medications, or other sedatives without clinician input.",
    stacks:["Selank"],
    safety:"Limited human data; reported side effects are mild (headache, grogginess) but the evidence base is genuinely sparse. Not approved for human use. Because it touches sleep and stress pathways, stacking with other sedatives or psychoactive medications is an interaction risk worth a clinician conversation. Experimental." },

  { name:"Selank", sub:"Anxiolytic / nootropic peptide", color:"#7DD4F9", tags:["Anxiety","Focus","Research"], evidence:"investigational",
    benefits:["Researched for anxiety reduction without sedation","Reported improvements in mood stability and stress resilience","Associated with mild cognitive/focus benefits in anecdotal reports"],
    overview:"A synthetic peptide derived from the immune peptide tuftsin, studied (again mostly in Russia) as an anti-anxiety and cognitive agent. Often used intranasally. Some human research exists but it's limited and not widely replicated.",
    mechanism:"Thought to modulate GABA and serotonin signaling and to influence BDNF and enkephalin systems — producing a calming, mildly nootropic effect without the sedation or dependence of benzodiazepines.",
    meta:{ dose:"~250–500 mcg/day", freq:"Daily or as needed", route:"Intranasal (or SubQ)", halfLife:"Short", storage:"Reconstituted: 2–8 °C", cycle:"Short blocks" },
    timeline:[["Acute","Subtle calming effect, often within an hour."],["Days","Anxiety/focus benefits build with consistent use."],["Block","Usually run for a few weeks then paused."],["Note","Frequently paired with Semax."]],
    cycleInfo:"Short blocks of 10–14 days are common; some run 2–3 weeks on, 1–2 weeks off. Tolerance development with extended daily use is reported anecdotally — breaks seem to preserve effect.",
    timingInfo:"Morning for cognitive/focus use; evening for anxiety relief or sleep support. Intranasal acts faster than SubQ (minutes vs. 30+ min). Avoid combining with psychiatric medications without clinician input.",
    stacks:["Semax","DSIP"],
    safety:"Reported as well-tolerated in the limited studies available, but human data is sparse and mostly from one research tradition. Not approved for human use outside a few countries. Effects on neurotransmitter systems mean interaction caution with psychiatric medications — worth a clinician conversation if you take any. Experimental." },

  { name:"Semax", sub:"Nootropic / neuroprotective peptide", color:"#9CDC5C", tags:["Focus","Neuroprotection","Research"], evidence:"investigational",
    benefits:["Researched for cognitive enhancement, focus, and memory support","Reported neuroprotective effects in Russian clinical research (stroke recovery)","Associated with improved mental clarity and reduced brain fog"],
    overview:"A synthetic peptide based on a fragment of ACTH, developed in Russia (where it's actually approved for stroke and cognitive indications) and used elsewhere as a nootropic. More clinical history than most research peptides, but little of it is Western/independent.",
    mechanism:"Increases BDNF and other neurotrophic factors, modulates dopamine and serotonin, and shows neuroprotective effects in models — the basis for both its cognitive-enhancement and stroke-recovery uses.",
    meta:{ dose:"~300–600 mcg/day", freq:"Daily or as needed", route:"Intranasal (or SubQ)", halfLife:"Short", storage:"Reconstituted: 2–8 °C", cycle:"Short blocks" },
    timeline:[["Acute","Focus/alertness often noticed within an hour."],["Days","Cognitive and mood benefits build with use."],["Block","Run for a few weeks then pause."],["Note","Commonly stacked with Selank."]],
    stacks:["Selank","DSIP"],
    cycleInfo:"Typically 10–14 day active blocks, then a break of equal length. Continuous daily use is uncommon and not recommended — cycling preserves the cognitive effect and avoids adaptation.",
    timingInfo:"Morning is strongly preferred — BDNF-related cognitive window is 4–6 hours post-dose. Empty stomach or light breakfast. Avoid afternoon/evening (can interfere with sleep). Intranasal acts fastest.",
    safety:"Has a longer clinical track record than most peptides here (approved for specific uses in Russia), but Western/independent safety data is limited. Generally well-tolerated; possible irritability or overstimulation at higher doses. Neurotransmitter effects mean interaction caution with psychiatric meds. Not FDA-approved. Clinician input wise if combining with other actives." },

  { name:"AHK-Cu", aliases:["AHK copper peptide"], sub:"Copper tripeptide — follicle & scalp focus", color:"#C8FF9C", tags:["Skin","Hair","Recovery","Research"], evidence:"investigational",
    overview:"AHK-Cu (Ala-His-Lys copper peptide) is a naturally occurring copper-binding tripeptide similar to GHK-Cu but with a distinct amino acid sequence and a stronger affinity for hair follicle biology. Used topically or via subcutaneous micro-dosing for hair loss and scalp health.",
    mechanism:"Activates follicular stem cells, prolongs anagen phase, and increases dermal papilla size. Copper binding enables collagen/elastin synthesis and anti-inflammatory signaling similar to GHK-Cu but with more follicle-directed tropism.",
    meta:{ dose:"100–500 mcg/day (subQ or topical)", freq:"Daily", route:"SubQ, topical, or intradermal", halfLife:"Short", storage:"Reconstituted: 2–8 °C, protect from light", cycle:"8–12 weeks" },
    cycleInfo:"8–12 week blocks with 4–6 week breaks. Often stacked with GHK-Cu for complementary skin + hair coverage.",
    timingInfo:"Flexible — no circadian requirement. Topical: apply to scalp or skin 1× daily. SubQ: any time, consistency matters more than exact timing.",
    stacks:["GHK-Cu","BPC-157","Sermorelin"],
    safety:"Very limited human safety data. Well-tolerated topically in most users. SubQ use is off-label and experimental. Avoid with active skin infection at injection site. Not approved for human use." },

  { name:"AOD-9604", aliases:["Anti-Obesity Drug 9604","HGH Fragment 177-191 variant"], sub:"HGH lipolytic fragment", color:"#F9C87D", tags:["Fat Loss","Metabolic","Research"], evidence:"investigational",
    overview:"AOD-9604 is a modified fragment of human growth hormone (hGH) designed to retain the fat-burning properties of growth hormone without the IGF-1-driven side effects (glucose dysregulation, tissue growth). Has Phase II/III human trial history — more clinical data than most research peptides.",
    mechanism:"Stimulates lipolysis (fat breakdown) and inhibits lipogenesis via beta-adrenergic receptors without binding the GH receptor. Does not raise IGF-1, blood glucose, or cause tissue proliferation at typical doses.",
    meta:{ dose:"250–500 mcg/day", freq:"Daily", route:"SubQ", halfLife:"~30 min", storage:"Reconstituted: 2–8 °C", cycle:"12–16 weeks" },
    cycleInfo:"Continuous daily use or cycling 5 on/2 off. Phase III trials ran for 12–24 weeks. Fat loss effects are modest; works best combined with calorie deficit and exercise.",
    timingInfo:"Fasted morning injection is most commonly used — lipolysis effect may be enhanced in the fasted state. Pre-workout is also common.",
    stacks:["CJC-1295 no DAC","Ipamorelin","5-Amino-1MQ"],
    safety:"Completed Phase III trials with a generally clean safety profile — no significant metabolic disruption or IGF-1 elevation at studied doses. Not FDA-approved despite trial history. Experimental for off-label use." },

  { name:"CJC-1295 with DAC", aliases:["CJC-1295 DAC","Drug Affinity Complex"], sub:"Long-acting GHRH analog", color:"#7DF9C0", tags:["GH","Recovery","Sleep","Research"], evidence:"investigational",
    overview:"CJC-1295 with DAC is a GHRH analog with a Drug Affinity Complex attached that binds to albumin and dramatically extends its half-life to ~8 days. This creates a sustained elevation of GH levels rather than the pulsatile release from the no-DAC version. Less common than CJC-1295 no DAC due to the less physiological pattern.",
    mechanism:"Binds GHRH receptors on the pituitary, stimulating GH release. The DAC modification causes the peptide to bind albumin in the bloodstream, extending half-life from ~30 min (no DAC) to ~8 days. Creates a sustained GH 'bleed' rather than pulsatile release.",
    meta:{ dose:"1–2 mg/week", freq:"1–2× per week", route:"SubQ", halfLife:"~8 days", storage:"Lyophilized: −20 °C; reconstituted: 2–8 °C", cycle:"12–16 weeks" },
    cycleInfo:"1–2 injections per week. Typical cycles 12–16 weeks followed by 4–8 week break. Often paired with Ipamorelin to amplify GH pulse without excessive cortisol/prolactin.",
    timingInfo:"Day-of-week consistency more important than time of day due to long half-life. Many prefer to time dose for a non-training day.",
    stacks:["Ipamorelin","BPC-157","TB-500"],
    safety:"Less physiological than pulsatile GHRH protocols. Sustained GH elevation increases long-term risk monitoring burden. Not approved for human use. Clinician involvement recommended." },

  { name:"GHRP-2", aliases:["Growth Hormone Releasing Peptide-2"], sub:"GH secretagogue (ghrelin mimetic)", color:"#9DC8FF", tags:["GH","Recovery","Appetite","Research"], evidence:"investigational",
    overview:"GHRP-2 is a potent synthetic GH secretagogue that strongly stimulates pituitary GH release. More potent than GHRP-6 with less appetite stimulation. Used for GH optimization, recovery, and anti-aging purposes.",
    mechanism:"Binds the ghrelin receptor (GHSR-1a) in the pituitary and hypothalamus, stimulating GH release independent of GHRH. Also increases cortisol and prolactin at higher doses — a key differentiator from peptide-based GHRH analogs.",
    meta:{ dose:"100–300 mcg", freq:"2–3× daily (or once before bed)", route:"SubQ or intranasal", halfLife:"~15–30 min", storage:"Reconstituted: 2–8 °C", cycle:"8–12 weeks" },
    cycleInfo:"Often run in 8–12 week blocks. Stacked with CJC-1295 no DAC or Sermorelin for synergistic GH amplification. 2–3 daily injections maximizes GH pulsatility.",
    timingInfo:"Fasted state for best GH response (avoid carbs/fat 1–2h before and 30 min after). Pre-sleep injection for natural sleep-associated GH pulse.",
    stacks:["CJC-1295 no DAC","Sermorelin","Ipamorelin"],
    safety:"Raises cortisol and prolactin at higher doses — relevant for stress-sensitive individuals. More side effects than Ipamorelin (water retention, tingling, appetite increase). Not approved." },

  { name:"GHRP-6", aliases:["Growth Hormone Releasing Peptide-6"], sub:"GH secretagogue (strong appetite stimulation)", color:"#9DC8FF", tags:["GH","Recovery","Appetite","Research"], evidence:"investigational",
    overview:"GHRP-6 was one of the first synthetic GH secretagogues studied. Effective but notable for causing significant appetite stimulation (via ghrelin mimicry) — which is either a benefit or drawback depending on goals.",
    mechanism:"Binds GHSR-1a, stimulating GH release and strongly increasing appetite. Also stimulates cortisol and prolactin to a degree. Less commonly used now that Ipamorelin and GHRP-2 are available with fewer side effects.",
    meta:{ dose:"100–300 mcg", freq:"2–3× daily", route:"SubQ", halfLife:"~15–30 min", storage:"Reconstituted: 2–8 °C", cycle:"8–12 weeks" },
    cycleInfo:"8–12 week cycles with breaks. Stacked with GHRH analogs. Less often chosen as a primary GH secretagogue now due to appetite side effect, but used intentionally by those who want the appetite stimulus.",
    timingInfo:"Fasted state preferred. Pre-sleep and morning injections most common.",
    stacks:["CJC-1295 no DAC","Sermorelin"],
    safety:"Significant appetite increase is expected and can undermine fat-loss goals. Cortisol/prolactin elevation. Water retention. Not approved for human use." },

  { name:"Hexarelin", aliases:["Examorelin"], sub:"Potent GH secretagogue", color:"#9DC8FF", tags:["GH","Cardiac","Recovery","Research"], evidence:"investigational",
    overview:"Hexarelin is one of the most potent synthetic GHRP-class peptides, stimulating strong GH release. Uniquely, it also has direct cardioprotective properties studied independently of GH. Desensitization with continuous use limits long-term protocols.",
    mechanism:"Binds GHSR-1a with high affinity, producing robust GH release. Also binds cardiac receptors directly (CD36/scavenger receptor), producing anti-fibrotic and cardioprotective effects independent of GH elevation.",
    meta:{ dose:"100–200 mcg", freq:"2× daily (limited duration)", route:"SubQ", halfLife:"~15–30 min", storage:"Reconstituted: 2–8 °C", cycle:"4–6 weeks max" },
    cycleInfo:"Shorter cycles (4–6 weeks) recommended due to desensitization. Receptor downregulation occurs faster than with Ipamorelin. Requires complete off-time before re-running.",
    timingInfo:"Fasted state. Same timing logic as other GHRPs.",
    stacks:["CJC-1295 no DAC","BPC-157"],
    safety:"Desensitization limits utility. Cortisol/prolactin elevation. More potent = more side effect potential. Not approved." },

  { name:"HGH Fragment 176-191", aliases:["HGH Frag 176-191","Fragment 176-191"], sub:"Lipolytic HGH C-terminal fragment", color:"#F9C87D", tags:["Fat Loss","Metabolic","Research"], evidence:"investigational",
    overview:"A truncated fragment of human growth hormone (amino acids 176–191) that retains HGH's fat-burning properties without the growth-promoting or insulin-desensitizing effects of full HGH. Note: AOD-9604 covers residues 177–191 with a slight modification — they're closely related.",
    mechanism:"Stimulates lipolysis via beta-adrenergic pathways without binding the GH receptor or elevating IGF-1. Does not cause glucose dysregulation or tissue proliferation.",
    meta:{ dose:"250–500 mcg/day", freq:"Once or twice daily", route:"SubQ", halfLife:"~30 min", storage:"Reconstituted: 2–8 °C", cycle:"12 weeks" },
    cycleInfo:"Continuous daily use, often in 12-week cycles. Best results with calorie deficit. Works synergistically with GH secretagogues.",
    timingInfo:"Fasted morning and/or pre-workout for maximum lipolytic effect. Avoid post-meal dosing.",
    stacks:["CJC-1295 no DAC","Ipamorelin","AOD-9604"],
    safety:"Clean safety profile in animal studies; limited human data. No IGF-1 or glucose effects at typical doses. Experimental." },

  { name:"IGF-1 LR3", aliases:["Insulin-like Growth Factor 1 Long R3"], sub:"IGF-1 analog (extended half-life)", color:"#A78BFA", tags:["Muscle","Recovery","Performance","Research"], evidence:"investigational",
    overview:"IGF-1 LR3 is a modified form of Insulin-like Growth Factor 1 with a 13-amino acid extension that prevents binding to IGF-binding proteins, dramatically extending half-life from ~12h to ~20–30h. Potent anabolic and anti-catabolic agent.",
    mechanism:"Binds IGF-1 receptors with high affinity, promoting muscle protein synthesis, satellite cell activation, and anti-catabolic signaling. More potent and longer-lasting than native IGF-1.",
    meta:{ dose:"20–50 mcg/day", freq:"Daily (short cycles)", route:"SubQ or IM", halfLife:"~20–30h", storage:"Reconstituted: 2–8 °C", cycle:"4 weeks max" },
    cycleInfo:"Short cycles (4 weeks maximum) due to receptor desensitization and risk of unregulated cell proliferation. Extended use is not advised without close medical supervision.",
    timingInfo:"Post-workout is the most commonly used timing — GH/IGF axis is most active in recovery window.",
    stacks:["BPC-157","TB-500"],
    safety:"Significant caution required. IGF-1 has proliferative potential — concerns around cancer risk with prolonged elevated levels, though this hasn't been established at peptide dosing. Hypoglycemia risk is real. Not for use without clinician involvement. Experimental and high-risk." },

  { name:"Kisspeptin", aliases:["Kisspeptin-10","Kisspeptin-54"], sub:"Hypothalamic signaling peptide / GnRH trigger", color:"#FF9CC8", tags:["Hormonal","Sexual Wellness","Research"], evidence:"investigational",
    overview:"Kisspeptin is a naturally occurring neuropeptide that acts as a master trigger for the hypothalamic-pituitary-gonadal (HPG) axis by stimulating GnRH release. Used in fertility medicine and researched for hormonal support and libido in both sexes.",
    mechanism:"Binds KISS1R receptors in the hypothalamus, triggering pulsatile GnRH release, which drives LH/FSH production and downstream sex hormone synthesis. Also has direct central effects on mood and attraction-related circuitry.",
    meta:{ dose:"Kisspeptin-10: 1–3 nmol/kg (clinical); community: 50–100 mcg", freq:"Pulsatile or daily (short cycles)", route:"SubQ or IV (clinical)", halfLife:"~30 min (K-10)", storage:"Reconstituted: 2–8 °C", cycle:"4–8 weeks" },
    cycleInfo:"Short cycles given HPG axis sensitivity. Clinical research uses pulsatile dosing to mimic natural patterns. Community protocols vary widely — low doses for hormonal support.",
    timingInfo:"Evening is common due to natural GnRH pulsatility rhythms. Clinician-guided dosing strongly preferred.",
    stacks:["Selank","PT-141"],
    safety:"Touches the HPG axis directly — hormonal disruption risk is real. Fertility applications require medical oversight. Not approved for recreational use. Experimental." },

  { name:"Oxytocin", aliases:["OT"], sub:"Bonding and stress-regulation peptide hormone", color:"#FF9CC8", tags:["Mood","Stress","Social","Research"], evidence:"emerging",
    overview:"Oxytocin is a naturally occurring neuropeptide hormone with well-established roles in social bonding, trust, stress reduction, and sexual/reproductive function. Used nasally for anxiolytic and social effects. FDA-approved in injectable form for obstetric use; intranasal use is off-label.",
    mechanism:"Binds oxytocin receptors in the brain (amygdala, hypothalamus) and periphery. Reduces HPA axis (cortisol) reactivity, promotes prosocial behavior, and modulates pain perception. Has direct uterine and mammary effects.",
    meta:{ dose:"10–40 IU intranasal", freq:"As needed or daily", route:"Intranasal", halfLife:"~1–2h (central effect)", storage:"Refrigerated", cycle:"As needed" },
    cycleInfo:"Most use is situational ('as needed') rather than continuous cycling. Some run daily for several weeks for stress/anxiety support. Avoid chronic daily use without breaks.",
    timingInfo:"30–60 min before desired effect. Social or therapeutic use: pre-event. Stress/anxiety support: morning or as needed.",
    stacks:["Selank","Kisspeptin"],
    safety:"Generally well-tolerated at intranasal doses. Interactions with cardiovascular medications (vasodilation). Avoid in individuals with hormonal or mental health conditions without clinician involvement. Do not use synthetic injectable forms without medical supervision." },

  { name:"PEG-MGF", aliases:["PEGylated Mechano Growth Factor","PEG Mechano Growth Factor"], sub:"Pegylated IGF-1Ec splice variant", color:"#A78BFA", tags:["Muscle","Recovery","Research"], evidence:"investigational",
    overview:"PEG-MGF is a PEGylated (stabilized) form of Mechano Growth Factor, a splice variant of IGF-1 that's produced locally in muscle tissue in response to mechanical stress. The PEG modification extends its half-life from ~minutes to ~days, allowing systemic activity.",
    mechanism:"Activates satellite cells (muscle stem cells) for repair and hypertrophy. Complementary to IGF-1 LR3 — MGF acts locally and acutely on damage, while IGF-1 drives systemic anabolism. PEGylation extends its systemic window.",
    meta:{ dose:"100–200 mcg 2× per week", freq:"2× weekly post-workout", route:"SubQ or IM (near target muscle)", halfLife:"~days (PEGylated)", storage:"Reconstituted: 2–8 °C", cycle:"4–6 weeks" },
    cycleInfo:"Short cycles (4–6 weeks). Often used as a post-workout adjunct alongside BPC-157 and TB-500 for recovery or alongside GH secretagogues for hypertrophy.",
    timingInfo:"Post-workout, ideally injected near the worked muscle group for local effect, though systemic effect occurs regardless.",
    stacks:["BPC-157","TB-500","IGF-1 LR3"],
    safety:"Limited human data. PEGylation adds an unknown long-term immunogenicity question (PEG allergies, anti-PEG antibodies). Proliferative potential similar to IGF-1. Experimental." },

  { name:"PT-141", aliases:["Bremelanotide"], sub:"Melanocortin agonist / sexual function peptide", color:"#FF9CC8", tags:["Sexual Wellness","Libido","Hormonal","Research"], evidence:"emerging",
    overview:"PT-141 (Bremelanotide) is a melanocortin receptor agonist FDA-approved (as Vyleesi) for hypoactive sexual desire disorder in premenopausal women. Used off-label in men and for enhanced sexual function generally. Acts centrally rather than through vascular mechanisms.",
    mechanism:"Binds MC3R and MC4R receptors in the hypothalamus and limbic system, triggering sexual arousal through central nervous system pathways — independent of testosterone or genital blood flow. This distinguishes it from PDE5 inhibitors (Viagra/Cialis).",
    meta:{ dose:"0.5–2 mg", freq:"As needed (1–2 hours before)", route:"SubQ or intranasal (off-label)", halfLife:"~2.7h", storage:"Reconstituted: 2–8 °C", cycle:"As needed — max 1× per 24h" },
    cycleInfo:"As-needed use only. Not intended for daily use. Start at lowest effective dose (0.5–1 mg) to assess nausea response.",
    timingInfo:"45–90 minutes before desired effect. Avoid food/alcohol 1h before — significantly increases nausea side effects.",
    stacks:["Kisspeptin","Oxytocin"],
    safety:"Nausea is the primary side effect — common, dose-dependent, worse with food/alcohol. Transient blood pressure increase. FDA-approved in women at specific doses. Avoid combining with other melanocortin agonists (Melanotan II). Not for cardiovascular disease without clinician clearance." },

  { name:"SS-31", aliases:["Elamipretide","MTP-131","Bendavia"], sub:"Mitochondria-targeted antioxidant peptide", color:"#9CC8FF", tags:["Longevity","Mitochondrial","Energy","Research"], evidence:"investigational",
    overview:"SS-31 (Elamipretide) is a tetrapeptide that selectively targets the inner mitochondrial membrane, reducing oxidative stress and improving mitochondrial function. In clinical trials for heart failure, Barth syndrome, and mitochondrial myopathy. One of the more legitimately studied peptides at the cellular aging level.",
    mechanism:"Binds cardiolipin on the inner mitochondrial membrane, stabilizing electron transport chain architecture and reducing reactive oxygen species (ROS) production. Improves ATP synthesis efficiency and mitochondrial cristae structure.",
    meta:{ dose:"1–5 mg/day (clinical); community: 1–2 mg/day", freq:"Daily", route:"SubQ", halfLife:"~2–3h", storage:"Reconstituted: 2–8 °C, protect from light", cycle:"4–12 weeks" },
    cycleInfo:"Daily dosing in blocks. Clinical trials have run daily dosing for weeks to months. Community use mirrors trial protocols — 4–12 week cycles with breaks.",
    timingInfo:"Consistent daily timing preferred. No strong rationale for specific time of day; morning is common for tracking compliance.",
    stacks:["NAD+","MOTS-c","Epithalon"],
    safety:"Generally well-tolerated in clinical trials at studied doses. Injection site reactions. Longer-term data accumulating from trials. Experimental for off-label use." },

  { name:"Tesofensine", aliases:["NS2330"], sub:"Triple monoamine reuptake inhibitor (weight loss)", color:"#F9C87D", tags:["Fat Loss","Metabolic","Cognitive","Research"], evidence:"investigational",
    overview:"Tesofensine is a triple reuptake inhibitor (dopamine, norepinephrine, serotonin) originally developed for Parkinson's and Alzheimer's that showed striking weight loss in clinical trials — 10–14% body weight in 24 weeks at studied doses. Not peptide-based; a small molecule.",
    mechanism:"Inhibits reuptake of dopamine, norepinephrine, and serotonin, reducing appetite through central satiety and reward pathway modulation. Also increases resting metabolic rate. Combined action differentiates it from GLP-1-class mechanisms.",
    meta:{ dose:"0.25–1 mg/day", freq:"Daily", route:"Oral", halfLife:"~8 days", storage:"Room temperature (oral capsule)", cycle:"12–24 weeks" },
    cycleInfo:"Long half-life means dosing effects are sustained. Clinical trials ran 24 weeks. Typically dose-escalated starting at 0.25 mg.",
    timingInfo:"Morning dosing preferred due to stimulant-like effects; evening dosing can impair sleep.",
    stacks:["Semaglutide","Retatrutide"],
    safety:"Cardiovascular effects (heart rate increase, blood pressure) require monitoring. Psychiatric effects (mood, anxiety, sleep) are meaningful. Not approved — development stalled due to CV concerns. Clinician involvement essential. Not a peptide — different mechanism and risk profile." },

  { name:"Thymosin Alpha-1", aliases:["Ta1","Thymalfasin"], sub:"Immune-modulating thymic peptide", color:"#9DC8FF", tags:["Immune","Longevity","Anti-viral","Research"], evidence:"emerging",
    overview:"Thymosin Alpha-1 is a peptide naturally secreted by the thymus gland that modulates immune function. Approved as Zadaxin in multiple countries for hepatitis B, hepatitis C, and immune enhancement in cancer patients. Widely used off-label for immune support, autoimmune conditions, and longevity.",
    mechanism:"Activates T-cell maturation and function, increases NK cell activity, stimulates dendritic cells, and upregulates major histocompatibility complex (MHC) expression. Has both immunostimulating and immunomodulating properties depending on context.",
    meta:{ dose:"1.6 mg 2× weekly (clinical standard)", freq:"2× weekly", route:"SubQ", halfLife:"~2h", storage:"Reconstituted: 2–8 °C", cycle:"4–12 weeks" },
    cycleInfo:"Standard clinical protocol: 1.6 mg SubQ twice weekly for 6–12 months for hepatitis indications. Community use: shorter cycles (4–12 weeks) for immune support.",
    timingInfo:"Any time of day — no circadian requirement. Consistent twice-weekly spacing (e.g., Mon/Thu) is preferred.",
    stacks:["BPC-157","Glutathione","SS-31"],
    safety:"Well-tolerated with a substantial clinical safety database (approved in 37+ countries). Mild injection site reactions. Theoretical concern about immune over-activation in autoimmune conditions — monitor if applicable. Clinician involvement wise for ongoing use." },

  { name:"Adifyline", aliases:["Acetyl Hexapeptide-49","SNAP-8 variant"], sub:"Neuropeptide mimetic — expression line reduction", color:"#C8FF9C", tags:["Skin","Anti-aging","Research"], evidence:"investigational",
    overview:"Adifyline is a synthetic hexapeptide designed to mimic the N-terminal domain of SNAP-25, a SNARE protein involved in neuromuscular acetylcholine release. It's used topically (rarely SubQ) to reduce dynamic expression lines by partially inhibiting the nerve-to-muscle signal at the injection/application site — a botulinum toxin-like mechanism without the toxin.",
    mechanism:"Competes with SNAP-25 at the SNARE complex, reducing acetylcholine vesicle release at neuromuscular junctions and thereby reducing muscle contraction intensity in the applied area. Effect is dose-dependent, reversible, and milder than botulinum toxin.",
    meta:{ dose:"Topical: 5–10% in formulation; SubQ: investigational", freq:"Daily (topical) or as directed", route:"Topical cream/serum", halfLife:"Short — topical penetration limited", storage:"Per formulation (typically room temp, away from light)", cycle:"Ongoing topical use" },
    cycleInfo:"Topical use is typically ongoing as part of a skincare routine. Effects are cumulative and require consistent daily application. Not typically cycled.",
    timingInfo:"Morning and/or evening application. Best on clean, slightly damp skin for penetration. Layer under moisturizer.",
    stacks:["GHK-Cu","AHK-Cu","GLOW"],
    safety:"Well-tolerated topically with no serious adverse events in cosmetic literature. The 'botulinum-like' mechanism is much weaker and fully reversible. SubQ use is experimental with limited human data. Not FDA-approved as a drug." },

  { name:"Cerebrolysin", aliases:["FPF-1070"], sub:"Neuropeptide mixture — neurotrophic / neuroprotective", color:"#A78BFA", tags:["Cognitive","Neuroprotection","Recovery","Research"], evidence:"emerging",
    overview:"Cerebrolysin is a standardized mixture of low-molecular-weight neuropeptides and free amino acids derived from pig brain proteins. Has decades of use in Eastern Europe and Asia for stroke, traumatic brain injury, Alzheimer's, and vascular dementia. The most clinically studied injectable nootropic compound. Approved in ~50 countries; not FDA-approved.",
    mechanism:"Contains peptides that mimic the effects of endogenous neurotrophic factors (BDNF, NGF, CNTF). Promotes neuronal survival, neuroplasticity, synaptic density, and anti-apoptotic signaling. Reduces oxidative stress in neural tissue.",
    meta:{ dose:"5–30 mL per injection (clinical); community: 5–10 mL IM or IV", freq:"Daily for 10–20 days, then off", route:"IM or IV (slow infusion preferred)", halfLife:"Short — neuropeptide components ~30 min active", storage:"Refrigerated, do not freeze", cycle:"10–20 day intensive cycles, 4–8 week break" },
    cycleInfo:"Classic protocol: 5–10 mL IM daily for 10–20 days, then a rest period. Repeat 2–4× per year. Some stack with Dihexa or Semax between cycles.",
    timingInfo:"Morning injections preferred — aligns with natural neurotrophic factor rhythms and avoids stimulation-related sleep interference. IV infusion over 30–60 minutes when using that route.",
    stacks:["Dihexa","Semax","Selank","NAD+","SS-31"],
    safety:"The most clinically studied compound in this list — decades of safety data, approved in many countries. IM is safer than IV (anaphylaxis risk with rapid IV infusion). Derived from animal tissue — screened for pathogens but carries theoretical biological contamination risk. Not appropriate for those with animal protein allergies. Clinician involvement essential for IV use." },

  { name:"Dihexa", aliases:["PNB-0408"], sub:"Angiotensin IV analog — cognitive enhancer", color:"#A78BFA", tags:["Cognitive","Neuroprotection","Longevity","Research"], evidence:"investigational",
    overview:"Dihexa is a small molecule derived from angiotensin IV that crosses the blood-brain barrier and potently stimulates synaptogenesis — the formation of new synaptic connections. Animal studies show cognitive enhancement orders of magnitude more potent than BDNF. No human clinical trials yet, but heavy community interest. Taken orally or transdermally.",
    mechanism:"Binds HGF receptor (c-Met) in the brain, activating synaptogenesis pathways. Increases dendritic spine density and promotes hippocampal synaptic formation. This mechanism is distinct from most nootropics and may explain the potent cognitive effects seen in animal models.",
    meta:{ dose:"Community: 10–30 mg oral or transdermal", freq:"Daily or every other day", route:"Oral or transdermal", halfLife:"Unknown — estimated hours", storage:"Cool, dark, dry", cycle:"Short cycles (2–4 weeks) with extended breaks" },
    cycleInfo:"Due to potency and lack of human long-term data, most users run short cycles (2–4 weeks) then take extended breaks (4–8 weeks). Some report persistent cognitive benefits after cycling.",
    timingInfo:"Morning is most common — cognitive activation may interfere with sleep if dosed late. Transdermal: apply to hairless skin (wrist, inner arm). Oral: empty or light stomach.",
    stacks:["Cerebrolysin","Semax","Selank","NAD+"],
    safety:"Zero human clinical trial data — all evidence is preclinical. The synaptogenic mechanism raises theoretical concerns about unregulated neural connectivity changes with chronic use. Potency makes dose precision important. This is one of the higher-uncertainty compounds in the community — clinician involvement and conservative dosing strongly advised. Experimental." },

  { name:"Pinealon", aliases:["Epitalon dipeptide","EDR peptide"], sub:"Pineal gland peptide — neuroprotective / longevity", color:"#9CC8FF", tags:["Longevity","Cognitive","Sleep","Neuroprotection","Research"], evidence:"investigational",
    overview:"Pinealon is a tripeptide (Glu-Asp-Arg) derived from peptide bioregulators research (primarily Russian/Soviet). Developed alongside Epithalon at the same institute. Proposed to support pineal gland function, neuroprotection, and age-related cognitive decline. Often used alongside Epithalon in longevity stacks.",
    mechanism:"Proposed to penetrate cell membranes and directly interact with DNA, influencing gene expression in neural and pineal cells. May upregulate melatonin synthesis pathways and support mitochondrial function in neurons. Mechanism remains poorly characterized in peer-reviewed Western literature.",
    meta:{ dose:"~5–10 mg per cycle (0.5–1 mg/day)", freq:"Daily during active cycle", route:"SubQ or intranasal", halfLife:"Very short", storage:"Reconstituted: 2–8 °C", cycle:"10-day cycles, 3–4× per year" },
    cycleInfo:"Typical protocol mirrors Epithalon: 10-day cycles taken 2–4× per year. Often co-administered with Epithalon in longevity protocols. Daily SubQ injections during the active window.",
    timingInfo:"Evening dosing is most common given the pineal/melatonin rationale — aligns with natural melatonin production timing.",
    stacks:["Epithalon","DSIP","SS-31","NAD+"],
    safety:"Very limited Western safety data. Long history of use in Russian peptide bioregulator research with reportedly clean safety profile, but independent verification is sparse. SubQ use experimental. Conservative dosing and infrequent cycles appropriate given evidence level." },

  { name:"SNAP-25", aliases:["SNAP-8","Acetyl Octapeptide-3","Leuphasyl"], sub:"SNARE inhibitor peptide — cosmetic neuromuscular", color:"#C8FF9C", tags:["Skin","Anti-aging","Research"], evidence:"investigational",
    overview:"SNAP-25 fragment peptides (most commonly SNAP-8, the 8-amino acid version) mimic the N-terminal sequence of the endogenous SNAP-25 protein, competing at the SNARE complex to reduce neuromuscular acetylcholine release. Used topically in cosmetic formulations for expression line reduction — a 'topical botox' mechanism. Related to but distinct from Adifyline (which targets the same pathway via a different sequence).",
    mechanism:"Competes with SNAP-25 at the SNARE complex assembly, reducing vesicular acetylcholine release at neuromuscular junctions in the dermis. Partially reduces muscular contraction force under the application site. Effect is milder than botulinum toxin and fully reversible.",
    meta:{ dose:"Topical formulations: 5–10 ppm active (in cosmetics)", freq:"Daily topical", route:"Topical cream or serum", halfLife:"Topical penetration-limited; hours", storage:"Room temperature, per formulation", cycle:"Ongoing cosmetic use" },
    cycleInfo:"Continuous topical use as part of skincare routine. No cycling needed for topical cosmetic use.",
    timingInfo:"Evening application is most common in anti-aging routines. Can also be used morning under SPF.",
    stacks:["GHK-Cu","AHK-Cu","Adifyline"],
    safety:"Well-tolerated in cosmetic formulations. No significant adverse events reported at cosmetic concentrations. The neuromuscular mechanism is mild and reversible — not comparable in scope or risk to botulinum toxin. Experimental for any injectable or systemic use." },
];
const EVIDENCE_BADGE = {
  established:   { label:"Clinically Studied", color:"#7DF9C0" },
  emerging:      { label:"Emerging Evidence",  color:"#F9C87D" },
  investigational:{ label:"Investigational — Limited Human Data", color:"#ff8c00" },
};
// Only these compounds auto-appear in the tracker on fresh install
function defaultState() {
  return {
    version: 1,
    // Fresh installs start with zero tracked compounds. A compound only enters here via
    // explicit user action: onboarding selection, Library "Track", protocol creation/import,
    // or logging a first dose. The full PEPTIDES reference library is untouched — this only
    // controls which compounds are in the user's personal tracker.
    peptides: {},
    customPeptides: {},
    dailyLogs: [], weightLogs: [], measurementLogs: [], activityLogs: [], macroLogs: [], supplementLogs: [], supplies: [], equipmentItems: [],
    settings: { weightUnit:"lbs", measureUnit:"in", remindersEnabled:false, lastNotifyDate:"", nexusApiKey:"", supplements:[], customSymptoms:[], lastSeenChangelog:0 },
    plans: { goals:[], research:[], shopping:[] },
    protocols: [], // v2: first-class Protocol entities
    comboPresets: [], // saved multi-compound "same syringe" combos for quick logging
    profile: { name:"", startDate:"", goalWeight:"", goalWaist:"", goalHips:"", goalGlute:"", protocolNotes:"", onboardingDone:false },
  };
}
// Keeps every dose's legacy kitId consistent with where the dose ACTUALLY came from.
//
// This used to be an inline "backfill legacy doses" loop that gave every dose without a
// kitId the compound's EARLIEST kit. It was written for pre-inventory-model doses (no kitId,
// no allocations) — but every modern dose is deliberately saved with kitId:null because it
// carries `allocations` instead, so on EVERY app load it stamped the earliest kit onto all of
// them. Harmless for a compound with one kit; for one with several (a 30mg kit and a later
// 10mg kit) it made recent doses claim to have come from the old kit. The edit-dose path
// trusted that stale kitId over the dose's real allocation, looked at a kit with no open
// vial, and refused an edit with "not enough in the open vial" about a vial that had nothing
// to do with the dose.
//
// The rule now: a dose's ALLOCATION is the record of where it came from, and kitId must agree
// with it (this also repairs existing mismatches on load). Only a true legacy dose — no kitId
// AND no allocations — falls back to the earliest-kit guess.
function reconcileDoseKitLinks(peptides, customPeptides, supplies) {
  const all = { ...(peptides||{}), ...(customPeptides||{}) };
  Object.entries(all).forEach(([name, p]) => {
    const kits = (supplies||[]).filter(s=>s.name===name);
    (p.doses||[]).forEach(dd => {
      const allocKits = (dd.allocations||[]).map(a=>a.kitId).filter(k=>k!=null);
      if (allocKits.length) {
        if (dd.kitId == null || !allocKits.includes(dd.kitId)) dd.kitId = allocKits[0];
        return;
      }
      if (dd.kitId || !kits.length) return;
      const target = kits.length===1 ? kits[0]
        : [...kits].sort((a,b)=>new Date(a.reconDate||a.id||0)-new Date(b.reconDate||b.id||0))[0];
      dd.kitId = target.id;
    });
  });
}
function migrate(d) {
  if (!d) return defaultState();
  const base = defaultState();
  // Forward-migrate: ensure status field on all peptide entries
  const ensureStatus = obj => { Object.keys(obj||{}).forEach(k => { if (!obj[k].status) obj[k].status = "active"; }); };
  ensureStatus(d.peptides); ensureStatus(d.customPeptides);
  // A compound can end up split across BOTH state.peptides and state.customPeptides at
  // once, if it gains (or loses) a real PEPTIDES config entry while someone already has
  // dose history under the OTHER bucket. Every place that decides where to read/write a
  // compound's data branches on !!PEPTIDES[name], which is only safe as long as that
  // classification never changes for a compound someone's already tracking — it isn't,
  // whenever a compound gets a proper entry added later (e.g. Ipamorelin/CJC-1295 no DAC
  // gaining real PEPTIDES entries for their mcg-unit fix). The moment that happens, a new
  // dose logs into a freshly-created, empty entry in the NEW bucket — and since
  // allPeptides() has customPeptides win the merge, that new entry (and the dose inside
  // it) becomes invisible everywhere, even though inventory still deducted correctly
  // (that path never looks at either bucket). This heals it permanently, for any compound,
  // not just the two that triggered finding it: whichever bucket PEPTIDES[name] says is
  // canonical now gets everything merged into it, deduped by id.
  if (d.peptides && d.customPeptides) {
    Object.keys(d.peptides).forEach(name => {
      const fromCustom = d.customPeptides[name];
      if (!fromCustom) return;
      const fromPeptides = d.peptides[name];
      const isBuiltinNow = !!PEPTIDES[name];
      const richer = (fromPeptides.doses||[]).length >= (fromCustom.doses||[]).length ? fromPeptides : fromCustom;
      const other = richer === fromPeptides ? fromCustom : fromPeptides;
      const dedupe = (a,b) => { const seen=new Map(); [...(a||[]),...(b||[])].forEach(x=>seen.set(x.id,x)); return [...seen.values()]; };
      const healed = { ...richer, doses: dedupe(richer.doses, other.doses), skips: dedupe(richer.skips, other.skips), reschedules: dedupe(richer.reschedules, other.reschedules) };
      if (isBuiltinNow) { d.peptides[name] = healed; delete d.customPeptides[name]; }
      else { d.customPeptides[name] = healed; delete d.peptides[name]; }
    });
  }
  const merged = { ...base, ...d,
    settings: { ...base.settings, ...(d.settings||{}) },
    profile:  { ...base.profile,  ...(d.profile||{}) },
    plans: { goals:(d.plans?.goals||[]), research:(d.plans?.research||[]), shopping:(d.plans?.shopping||[]) },
    protocols: d.protocols||[],
    activityLogs: d.activityLogs||[], measurementLogs: d.measurementLogs||[], macroLogs: d.macroLogs||[], supplementLogs: d.supplementLogs||[], supplies: d.supplies||[], equipmentItems: d.equipmentItems||[],
    comboPresets: d.comboPresets||[] };
  reconcileDoseKitLinks(merged.peptides, merged.customPeptides, merged.supplies);
  // Migrate Supplies to the unit-tracked architecture (mirrors Compound Kits).
  // Old shape: one flat item per instance (status, volumeMl/mlRemaining OR quantity).
  // New shape: one line per type+brand, with a `units[]` array (sealed/active/empty)
  // and a `usageLog[]` that consumption forecasting reads from. Already-migrated
  // items (have `.units`) pass through untouched.
  merged.equipmentItems = (merged.equipmentItems||[]).map(item=>{
    if (item.units) return item; // already new-shape
    const isBac = item.type==="BAC Water";
    const unitSize = isBac ? (parseFloat(item.volumeMl)||30) : (parseInt(item.quantity)||1);
    const unitOfMeasure = isBac ? "mL" : "units";
    const unitLabel = isBac ? "bottle" : (item.type==="Syringes"?"box":item.type==="Needles"?"box":item.type==="Alcohol Wipes"?"pack":"unit");
    const oldStatus = item.status||"unopened";
    const unitStatus = oldStatus==="unopened" ? "sealed" : oldStatus==="open" ? "active" : "empty"; // empty+discarded both fold to empty
    const consumed = isBac && item.mlRemaining!=null && item.volumeMl!=null
      ? Math.max(0, parseFloat(item.volumeMl)-parseFloat(item.mlRemaining))
      : (unitStatus==="empty" ? unitSize : 0);
    return {
      id: item.id, type: item.type, brand: item.brand||"",
      storageLocation: item.storageLocation||"unknown", notes: item.notes||"",
      unitLabel, unitSize, unitOfMeasure,
      units: [{ id: item.id, status: unitStatus, openedDate: item.openedDate||null, emptiedDate: unitStatus==="empty"?(item.openedDate||null):null, consumed }],
      usageLog: [],
    };
  });
  // Enforce one active unit per supply, for both freshly-migrated items and any
  // already-new-shape item that might have ended up with two (a bug, or a manually
  // edited localStorage blob) — never silently ignore the extra one.
  merged.equipmentItems = merged.equipmentItems.map(normalizeSupplyUnits);
  return merged;
}
function normalizeSupplyUnits(item) {
  const actives = (item.units||[]).filter(u=>u.status==="active");
  if (actives.length <= 1) return item;
  // Keep the one open longest (earliest openedDate) as the real active unit; the rest
  // return to the sealed pool rather than being silently dropped or marked empty —
  // we don't actually know whether they were genuinely in use, so don't guess.
  const sorted = [...actives].sort((a,b)=>new Date(a.openedDate||0)-new Date(b.openedDate||0));
  const keep = sorted[0];
  item.units = (item.units||[]).map(u => (u!==keep && u.status==="active") ? {...u, status:"sealed", openedDate:null, consumed:0} : u);
  return item;
}
// "Since your last visit" — computed ONCE at boot from the previous lastVisitAt
// timestamp, kept in a plain module variable (never on `state`) so it can never get
// serialized/corrupted by saveState(). Only shown for a meaningful gap, and only once
// per app open — dismissing just clears the in-memory variable, nothing persisted.
let sinceLastVisitSummary = null;
function computeSinceLastVisit() {
  const prev = state.settings.lastVisitAt;
  const now = Date.now();
  state.settings.lastVisitAt = now;
  if (!prev) return null; // first-ever session — nothing to compare against
  const gapHours = (now - prev) / 3600000;
  if (gapHours < 8) return null; // not a meaningful gap
  const bullets = [];
  const aps = allPeptides();

  const dosesSince = Object.values(aps).flatMap(d=>(d.doses||[]).filter(x=>new Date(x.date).getTime()>prev)).length;
  if (dosesSince) bullets.push(`${dosesSince} dose${dosesSince===1?"":"s"} logged`);

  const wSorted = [...state.weightLogs].sort((a,b)=>new Date(a.date)-new Date(b.date));
  const beforeVisit = [...wSorted].reverse().find(w=>new Date(w.date).getTime()<=prev);
  const latestW = wSorted[wSorted.length-1];
  if (beforeVisit && latestW && new Date(latestW.date).getTime()>prev) {
    const delta = latestW.weight - beforeVisit.weight;
    if (Math.abs(delta) >= 0.1) bullets.push(`Weight ${delta<0?"−":"+"}${Math.abs(delta).toFixed(1)} ${state.settings.weightUnit||"lb"}`);
  }

  const reschedSince = Object.values(aps).flatMap(d=>(d.reschedules||[]).filter(r=>new Date(r.originalDate).getTime()>prev-86400000 && new Date(r.originalDate).getTime()<=now)).length;
  if (reschedSince) bullets.push(`${reschedSince} dose${reschedSince===1?"":"s"} rescheduled`);

  // Consecutive-day streak for any symptom logged on every day since the visit
  const daysSinceVisit = Math.floor((now-prev)/86400000);
  if (daysSinceVisit>=2 && daysSinceVisit<=10) {
    const logsSince = state.dailyLogs.filter(l=>new Date(l.date).getTime()>prev);
    const byDay = {}; logsSince.forEach(l=>{ (l.symptoms||[]).forEach(s=>{ const nm=typeof s==="string"?s:s.name; (byDay[nm]=byDay[nm]||new Set()).add(dayKey(l.date)); }); });
    Object.entries(byDay).forEach(([nm,days])=>{ if(days.size>=3) bullets.push(`${nm} logged ${days.size} consecutive days`); });
  }

  return bullets.length ? bullets : null;
}
let state = migrate(loadState());
let tab = "home";

function allPeptides() {
  const out = {};
  // Only compounds explicitly in state.peptides (not every PEPTIDES key)
  Object.keys(state.peptides||{}).forEach(k=>{
    if(!PEPTIDES[k]) return;
    const s=state.peptides[k];
    if(s.status==="archived") return;
    out[k]=s;
  });
  Object.entries(state.customPeptides||{}).forEach(([n,d])=>{ if(d.status!=="archived") out[n]=d; });
  return out;
}
function allPeptidesIncArchived() {
  const out = {};
  Object.keys(state.peptides||{}).forEach(k=>{ if(PEPTIDES[k]) out[k]=state.peptides[k]; });
  Object.entries(state.customPeptides||{}).forEach(([n,d])=>out[n]=d);
  return out;
}
function isInStack(name) {
  const s = (state.peptides[name] || state.customPeptides[name]);
  return !!s && s.status !== "archived";
}
function initCompoundTracking(name) {
  if (isInStack(name)) return;
  if (PEPTIDES[name]) {
    if (!state.peptides[name]) state.peptides[name] = {};
    state.peptides[name] = { ...state.peptides[name], status:"active", scheduleDays:PEPTIDES[name].defaultSchedule, doses: state.peptides[name]?.doses||[] };
  } else {
    state.customPeptides[name] = { status:"active", scheduleDays:7, doses:[] };
  }
}
function addBlendKitModal(blendNameOrKit) {
  // Editing an existing blend kit was previously impossible: the Stash card's own Edit
  // button always opened the single-compound supplyModal regardless of isBlend, whose
  // compound dropdown correctly excludes blends (it's for a NEW single-compound kit) —
  // so a blend had nowhere to go there. This function now doubles as the editor too,
  // triggered by passing the actual kit object instead of a name string.
  const existingKit = (blendNameOrKit && typeof blendNameOrKit === "object") ? blendNameOrKit : null;
  const isEdit = !!existingKit;
  const blendName = isEdit ? existingKit.name : blendNameOrKit;
  const isCustomNew = !isEdit && !blendName;
  const defaultComp = isEdit ? existingKit.composition.map(c=>({...c})) : (BLEND_COMPOSITIONS[blendName] || []).map(c => ({...c}));
  let composition = defaultComp.length ? defaultComp : [{compound:"", mg:0}, {compound:"", mg:0}];
  let name = blendName || "";
  const knownCompounds = [...new Set([...Object.keys(PEPTIDES), ...LIBRARY.filter(l=>!l.blend).map(l=>l.name), ...Object.keys(state.customPeptides||{})])].sort();

  const compoundOptions = (selected) => `<option value="">— select —</option>${knownCompounds.map(n=>`<option value="${esc(n)}" ${selected===n?"selected":""}>${esc(n)}</option>`).join("")}<option value="__other__" ${selected&&!knownCompounds.includes(selected)?"selected":""}>Other (type name)…</option>`;

  const renderCompRows = () => composition.map((c,i) => {
    const isOther = c.compound && !knownCompounds.includes(c.compound);
    return `
    <div class="comp-row" data-i="${i}" style="display:flex;gap:6px;align-items:center;margin-bottom:6px">
      <select class="inp comp-select" data-i="${i}" style="flex:1.4;padding:8px">${compoundOptions(c.compound)}</select>
      ${isOther?`<input type="text" class="inp comp-other" data-i="${i}" value="${esc(c.compound)}" placeholder="Compound name" style="flex:1.2;padding:8px">`:""}
      <input type="number" class="inp comp-mg-input" data-i="${i}" value="${c.mg||""}" placeholder="mg" style="width:64px;padding:8px" step="0.1">
      ${composition.length>1?`<button class="comp-remove" data-i="${i}" style="background:transparent;border:none;color:var(--t5);font-size:16px;padding:4px 6px">✕</button>`:`<span style="width:24px"></span>`}
    </div>`;
  }).join("");

  const rebuild = () => {
    m.querySelector("#comp-rows").innerHTML = renderCompRows();
    m.querySelector("#comp-total").textContent = `Total: ${composition.reduce((a,c)=>a+(+c.mg||0),0)}mg per vial`;
    wireRows();
  };

  const wireRows = () => {
    m.querySelectorAll(".comp-select").forEach(sel => sel.onchange = () => {
      const i = +sel.dataset.i;
      composition[i].compound = sel.value === "__other__" ? "" : sel.value;
      rebuild();
    });
    m.querySelectorAll(".comp-other").forEach(inp => inp.oninput = () => { composition[+inp.dataset.i].compound = inp.value.trim(); });
    m.querySelectorAll(".comp-mg-input").forEach(inp => inp.oninput = () => {
      composition[+inp.dataset.i].mg = parseFloat(inp.value)||0;
      m.querySelector("#comp-total").textContent = `Total: ${composition.reduce((a,c)=>a+(+c.mg||0),0)}mg per vial`;
    });
    m.querySelectorAll(".comp-remove").forEach(btn => btn.onclick = () => { composition.splice(+btn.dataset.i, 1); rebuild(); });
  };

  const m = openModal(`
    <div style="font-size:14px;font-weight:700;color:var(--t1);margin-bottom:4px">${isEdit?"Edit "+esc(name):isCustomNew?"Create Custom Blend":"Add "+esc(blendName)}</div>
    <div class="hint" style="margin-bottom:14px">${isEdit?"Correcting the composition only changes vials opened from now on — vials you've already activated keep the ratio they were opened with, so past inventory math doesn't shift under you.":"This tracks as ONE physical vial with a fixed compound ratio — not separate kits for each compound. "+(isCustomNew?"Name it whatever you'd call it, list every compound in the vial and how many mg of each.":"Confirm the composition matches your actual vial's label — suppliers vary.")}</div>
    ${isCustomNew?`<label class="field-label">BLEND NAME</label><input id="bk-name" type="text" class="inp" placeholder="e.g. Deadpool" value="${esc(name)}" style="margin-bottom:14px">`:""}
    ${isEdit?`<label class="field-label">BLEND NAME</label><input type="text" class="inp" value="${esc(name)}" disabled style="margin-bottom:4px;opacity:0.6"><div style="font-size:10px;color:var(--t5);margin-bottom:14px">Renaming isn't supported here yet — it would orphan this compound's existing dose history. Delete and recreate if you truly need a different name.</div>`:""}
    <label class="field-label">COMPOSITION PER VIAL</label>
    <div id="comp-rows" style="margin-bottom:6px">${renderCompRows()}</div>
    <button id="comp-add" style="background:transparent;border:none;padding:4px 0;font-size:11.5px;color:#C9A0FF;margin-bottom:10px;text-align:left">+ Add another compound</button>
    <div id="comp-total" style="font-size:11px;color:var(--t4);margin-bottom:14px">Total: ${composition.reduce((a,c)=>a+(+c.mg||0),0)}mg per vial</div>

    ${!isEdit?`<div style="display:flex;gap:10px;margin-bottom:12px">
      <div style="flex:1"><label class="field-label">VIALS ON HAND</label><input id="bk-vials" type="number" min="1" class="inp" value="1"></div>
      <div style="flex:1"><label class="field-label">BAC WATER (mL)</label><input id="bk-bac" type="number" step="0.1" class="inp" placeholder="e.g. 2"></div>
    </div>
    <label style="display:flex;align-items:center;gap:10px;margin-bottom:12px;font-size:13px;color:var(--t3)"><input id="bk-active" type="checkbox" checked style="accent-color:#C9A0FF"> One vial is already reconstituted / in use</label>`:`<div style="font-size:10.5px;color:var(--t5);margin-bottom:12px">Vials, reconstitution, and BAC water are managed from Manage Kit (Add Vials, Reconstitute, Finish Vial) — not here.</div>`}
    <div style="display:flex;gap:10px;margin-bottom:12px">
      <div style="flex:1"><label class="field-label">STORAGE</label><select id="bk-storage" class="inp"><option value="fridge" ${existingKit?.storageLocation==="fridge"?"selected":""}>Fridge</option><option value="freezer" ${existingKit?.storageLocation==="freezer"?"selected":""}>Freezer</option><option value="room_temp" ${existingKit?.storageLocation==="room_temp"?"selected":""}>Room temp</option></select></div>
      <div style="flex:1"><label class="field-label">COST (optional)</label><input id="bk-cost" type="number" step="0.01" class="inp" value="${existingKit?.cost?esc(existingKit.cost):""}" placeholder="e.g. 180"></div>
    </div>
    <div style="display:flex;gap:10px;margin-bottom:12px">
      <div style="flex:1;min-width:0"><label for="bk-expiry" class="field-label">EXPIRY AFTER RECON (DAYS)</label><input id="bk-expiry" type="number" min="1" step="1" class="inp" value="${existingKit?.expiryDays||28}"></div>
      <div style="flex:1;min-width:0"><label for="bk-bac-edit" class="field-label">BAC WATER (mL)</label><input id="bk-bac-edit" type="number" min="0.01" step="0.1" class="inp" value="${existingKit?.bacMl||""}" placeholder="At vial opening"></div>
    </div>
    <label for="bk-notes" class="field-label">KIT NOTES (OPTIONAL)</label>
    <textarea id="bk-notes" class="inp" rows="2" style="margin-bottom:14px" placeholder="Storage, lot or other kit notes">${esc(existingKit?.notes||"")}</textarea>
    <button id="bk-save" class="btn-primary" style="background:#C9A0FF">${isEdit?"Save Changes":"Add to Stash"}</button>
  `, "#C9A0FF");

  wireRows();
  const addBtn = m.querySelector("#comp-add");
  if (addBtn) addBtn.onclick = () => { composition.push({compound:"", mg:0}); rebuild(); };
  const nameInput = m.querySelector("#bk-name");
  if (nameInput) nameInput.oninput = () => { name = nameInput.value.trim(); };

  m.querySelector("#bk-save").onclick = () => {
    const finalName = isEdit ? existingKit.name : (isCustomNew ? name.trim() : blendName);
    if (!finalName) { showErrorBanner("Give this blend a name first."); return; }
    const validComponents = composition.filter(c => c.compound && (+c.mg||0) > 0);
    if (validComponents.length < 2) { showErrorBanner("A blend needs at least 2 compounds, each with an mg amount."); return; }
    if (!isEdit && isCustomNew && (state.supplies||[]).some(s=>s.name===finalName)) { showErrorBanner(`You already have a "${finalName}" kit — pick a different name, or use Manage Kit → Add Vials on the existing one.`); return; }
    const totalMg = validComponents.reduce((a,c)=>a+(+c.mg||0),0);

    if (isEdit) {
      // Only the template changes — composition (for vials opened from now on) plus
      // storage/cost. Vial count, reconstitution state, and every existing vial's own
      // locked-in ratio are untouched; those live in Add Vials/Reconstitute/Finish Vial.
      existingKit.composition = validComponents.map(c=>({...c}));
      existingKit.vialMg = totalMg;
      existingKit.storageLocation = m.querySelector("#bk-storage").value;
      existingKit.cost = m.querySelector("#bk-cost").value;
      const expiry=Number(m.querySelector("#bk-expiry").value);
      const bac=Number(m.querySelector("#bk-bac-edit").value);
      if(!Number.isSafeInteger(expiry)||expiry<1||expiry>3650||(!Number.isFinite(bac))||bac<0){showErrorBanner("Check blend expiry and BAC water amounts.");return;}
      existingKit.expiryDays=expiry;existingKit.bacMl=bac;
      existingKit.notes=m.querySelector("#bk-notes").value.trim();
      initCompoundTracking(isEdit ? existingKit.name : finalName);
      saveState(); closeModal(); render();
      return;
    }

    const totalVials = Math.max(1, parseInt(m.querySelector("#bk-vials").value)||1);
    const bacMl = parseFloat(m.querySelector("#bk-bac").value)||0;
    const oneActive = m.querySelector("#bk-active").checked;
    const kit = {
      id: uid(), name: finalName, isBlend: true, composition: validComponents.map(c=>({...c})),
      totalVials, vialMg: totalMg, bacMl,
      openedVials: oneActive?1:0, emptyVials: 0,
      reconDate: oneActive?localDate():null, expiryDays: Math.max(1,parseInt(m.querySelector("#bk-expiry").value,10)||28),
      activeKit: oneActive, storageLocation: m.querySelector("#bk-storage").value,
      cost: m.querySelector("#bk-cost").value, currency: "CAD", notes: m.querySelector("#bk-notes").value.trim(),
      doseLog: [], wasteLog: [], reconHistory: oneActive?[{id:uid(), date:localDate(), notes:""}]:[],
    };
    if (!state.supplies) state.supplies = [];
    state.supplies.push(kit);
    // Constituent compounds still need to exist in state.peptides so their own dose
    // history/symptom tracking works — but they get NO separate Stash kit of their own;
    // this one blend vial is the only physical inventory record.
    initCompoundTracking(isEdit ? existingKit.name : finalName);
    saveState(); closeModal(); render();
  };
}

// Single source of truth for a blend kit's remaining mg — used by both the card display
// and the actual save-time validation in logBlendDoseModal, so the number a person sees
// right before logging a dose is exactly the number that gates whether that dose is
// allowed. Blend kits are a genuinely different, simpler shape than the vials[]-based
// peptide kit model this session rebuilt — one mixed vial at a time, no reconstitution
// rollover, no sealed backups — so this deliberately isn't routed through
// consumeCompoundInventory; it's proportionate to keep it in its own small, self-
// consistent formula rather than force-fit a structurally different product into that
// engine.
function getBlendKitRemainingMg(kit) {
  const totalMg = (kit.totalVials||0) * (kit.vialMg||0);
  const totalUsedMg = (kit.doseLog||[]).reduce((a,d)=>a+(d.totalMgDrawn||0),0);
  const totalWasteMg = getKitActiveWasteMg(kit);
  const allVialsMarkedEmpty = (kit.totalVials||0)>0 && (kit.emptyVials||0)>=(kit.totalVials||0);
  const emptyCapMg = Math.max(0, ((kit.totalVials||0)-(kit.emptyVials||0)) * (kit.vialMg||0));
  const ledgerRemMg = Math.max(0, totalMg-totalUsedMg-totalWasteMg);
  return allVialsMarkedEmpty ? 0 : Math.min(ledgerRemMg, emptyCapMg);
}

// Blend vials are ONE premixed inventory item. Never create separate constituent-dose
// entries when opening a physical blend vial or logging that blend.
function openBlendVialModal(kitId) {
  const kit=(state.supplies||[]).find(k=>k.id===kitId && k.isBlend);
  if(!kit) return;
  const available=getSealedVials(kit);
  if(!available.length){showErrorBanner("No sealed blend vials remain in this kit.");return;}
  if(kit.reconDate && kit.activeKit && ensureKitVials(kit).some(v=>v.status==="active"||v.status==="open")){
    showErrorBanner("A blend vial is already open. Finish it before opening another.");return;
  }
  const m=openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <span class="mono" style="font-size:13px;color:#A78BFA;letter-spacing:1.5px">OPEN NEW VIAL</span>
      <button type="button" id="nx-blend-cancel" aria-label="Close open vial" style="color:var(--t2);min-width:44px;min-height:44px;font-size:18px">✕</button>
    </div>
    <div style="background:var(--surface-2);border:1px solid var(--border-sub);border-radius:10px;padding:14px;margin-bottom:16px">
      <div style="font-size:11px;color:var(--t2);font-weight:600;margin-bottom:10px">VIAL DETAILS</div>
      <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px">
        <div><label class="field-label">VIALS IN KIT</label><div class="inp" style="padding:9px 8px;font-size:12px;min-height:44px">${kit.totalVials||0}</div></div>
        <div><label class="field-label">MG PER VIAL</label><div class="inp" style="padding:9px 8px;font-size:12px;min-height:44px">${kit.vialMg||0}</div></div>
        <div><label for="nx-blend-bac" class="field-label">BAC WATER (mL)</label><input id="nx-blend-bac" type="number" min="0.01" step="0.1" class="inp" value="${kit.bacMl>0?kit.bacMl:""}" placeholder="e.g. 3" style="padding:9px 8px;font-size:12px;min-height:44px"></div>
      </div>
      <div style="font-size:11px;color:var(--t3);margin-top:8px">${esc(kit.name)} · premixed blend · ${(kit.composition||[]).length} components</div>
    </div>
    <label for="nx-blend-date" class="field-label">RECONSTITUTION DATE</label>
    <input id="nx-blend-date" type="date" class="inp" value="${localDate()}" style="margin-bottom:14px">
    <label for="nx-blend-expiry" class="field-label">EXPIRY AFTER RECON (DAYS)</label>
    <input id="nx-blend-expiry" type="number" min="1" step="1" class="inp" value="${kit.expiryDays||28}" style="margin-bottom:14px">
    <label for="nx-blend-notes" class="field-label">NOTES (lot #, batch, anything notable)</label>
    <textarea id="nx-blend-notes" class="inp" rows="2" style="margin-bottom:18px" placeholder="optional"></textarea>
    <button type="button" id="nx-blend-open" class="btn-primary" style="width:100%;min-height:48px;background:#A78BFA;color:#1A1728;font-weight:700">Log Reconstitution</button>
  `, "#A78BFA");
  m.querySelector("#nx-blend-cancel").onclick=closeModal;
  m.querySelector("#nx-blend-open").onclick=()=>{
    const bac=Number(m.querySelector("#nx-blend-bac").value);
    const days=Number(m.querySelector("#nx-blend-expiry").value);
    const date=m.querySelector("#nx-blend-date").value;
    if(!Number.isFinite(bac)||bac<=0||!Number.isSafeInteger(days)||days<1||days>3650||!/^\d{4}-\d{2}-\d{2}$/.test(date)){
      showErrorBanner("Enter valid BAC water, expiry days and reconstitution date.");return;
    }
    const remaining=getSealedVials(kit);
    if(!remaining.length){showErrorBanner("No sealed blend vial remains.");return;}
    const vial=remaining[0];
    vial.status="open"; vial.reconDate=date; vial.bacMl=bac;
    vial.expiryDays=days; vial.notes=m.querySelector("#nx-blend-notes").value.trim();
    kit.bacMl=bac;kit.expiryDays=days;kit.reconDate=date;
    kit.openedVials=(kit.openedVials||0)+1;
    kit.activeKit=true;
    kit.reconHistory=kit.reconHistory||[];
    kit.reconHistory.push({id:uid(),date,notes:vial.notes,vialId:vial.id,bacMl:bac,expiryDays:days});
    saveState();closeModal();render();
  };
}

// The kit total includes sealed inventory; an administered draw is limited by
// the ONE opened blend vial. Vial IDs prevent same-day rollover double counting.
function getBlendOpenVialRemainingMg(kit) {
  const open=ensureKitVials(kit).find(v=>v.status==="open"||v.status==="active");
  if(!open || !kit.reconDate) return 0;
  const date=open.reconDate||kit.reconDate;
  const consumed=(kit.doseLog||[]).filter(d=>d.vialId!=null
    ? String(d.vialId)===String(open.id)
    : new Date(d.date)>=new Date(date)).reduce((n,d)=>n+(Number(d.totalMgDrawn)||0),0);
  const wasted=(kit.wasteLog||[]).filter(w=>w.status!=="reversed" &&
    (w.vialId!=null ? String(w.vialId)===String(open.id) :
      (w.loggedAt ? new Date(w.loggedAt) : safeDate(w.date))>=safeDate(date)))
    .reduce((n,w)=>n+(Number(w.mg)||0),0);
  return Math.max(0,Math.min(getBlendKitRemainingMg(kit),
    (Number(open.vialMg)||Number(kit.vialMg)||0)-consumed-wasted));
}

// Explicit blend vial closure preserves mass balance before another vial opens.
// Closing with leftovers records outflow; it never erases prior doses or kit history.
function finishBlendVialModal(kitId) {
  const kit=(state.supplies||[]).find(k=>k.id===kitId && k.isBlend);
  if(!kit) return;
  const vial=ensureKitVials(kit).find(v=>v.status==="open"||v.status==="active");
  if(!vial){showErrorBanner("No blend vial is currently open.");return;}
  const rem=getBlendOpenVialRemainingMg(kit);
  confirmAction(`Finish the current ${esc(kit.name)} vial? ${rem.toFixed(2)} mg remaining will be recorded as discarded outflow. Existing dose logs stay unchanged.`,()=>{
    const latest=ensureKitVials(kit).find(v=>String(v.id)===String(vial.id));
    if(!latest || !["open","active"].includes(latest.status))return;
    const remaining=getBlendOpenVialRemainingMg(kit);
    if(remaining>0) {
      kit.wasteLog=kit.wasteLog||[];
      kit.wasteLog.push({id:uid(),date:localDate(),loggedAt:new Date().toISOString(),
        mg:remaining,type:"waste",reason:"Blend vial finished with remainder",
        status:"active",vialId:latest.id});
    }
    latest.status="finished";
    kit.emptyVials=(kit.emptyVials||0)+1;
    kit.reconDate=null;
    saveState();render();
  },{tone:"warning",confirmLabel:"Finish vial",cancelLabel:"Keep open"});
}

function logBlendDoseModal(kitId) {
  const kit = (state.supplies||[]).find(s=>s.id===kitId); if (!kit || !kit.isBlend) return;
  const totalMg = kit.vialMg||0;
  const remainingMg = getBlendOpenVialRemainingMg(kit);
  if(!kit.reconDate || !ensureKitVials(kit).some(v=>v.status==="open"||v.status==="active")){showErrorBanner("Open and reconstitute a blend vial in Stash before logging a dose.");return;}
  const m = openModal(`
    <div class="nx2-dose-shell">
      <div class="nx-dose-body">
        <div class="nx2-dose-head">
          <div><div class="mono" style="font-size:10px;letter-spacing:1.5px;color:var(--t3)">NEW ENTRY</div>
          <h2 style="color:var(--t1);font-size:22px;margin:5px 0">Log a dose</h2>
          <div style="color:var(--t3);font-size:13px">${esc(kit.name)}</div></div>
          <button type="button" id="bd-close" aria-label="Close dose form" style="min-height:44px;min-width:44px;border:1px solid var(--border);border-radius:12px;background:var(--surface-2);color:var(--t2)">✕</button>
        </div>
        <section class="nx-dose-section" aria-label="Dose source">
          <div class="nx-dose-section-title">Dose source</div>
          <p class="nx-dose-section-desc">Select the prepared dose or vial used for this entry.</p>
          <div class="nx-dose-source-readout"><span class="nx-dose-source-dot" aria-hidden="true"></span>
          <div><strong>Fresh from vial</strong><small>Open ${esc(kit.vialMg)}mg vial · ${remainingMg.toFixed(2)}mg remaining</small></div></div>
        </section>
        <section class="nx-dose-section" aria-label="Administration details">
          <div class="nx-dose-section-title">Administration details</div>
          <p class="nx-dose-section-desc">Review the amount, date and administration site.</p>
          <label for="bd-date" class="field-label">DATE & TIME</label>
          <div style="display:flex;gap:8px;margin-bottom:14px">
            <input id="bd-date" type="datetime-local" class="inp" value="${localDatetime()}" style="flex:1;min-width:0">
            <button type="button" id="bd-now" style="min-height:44px;padding:0 14px;border-radius:10px;background:var(--surface-2);border:1px solid var(--border);color:var(--t2)">Now</button>
          </div>
          <label for="bd-amount" class="field-label">DOSE (mg)</label>
          <input id="bd-amount" type="number" min="0" step="0.01" class="inp" placeholder="e.g. 3" style="margin-bottom:8px">
          <div id="bd-preview" style="font-size:12px;color:var(--t3);line-height:1.6;margin-bottom:12px" aria-live="polite"></div>
          <div id="bd-shortage" style="display:none;padding:12px;border:1px solid var(--border);border-radius:10px;margin-bottom:14px;color:var(--t2)"></div>
          <label for="bd-site" class="field-label">INJECTION SITE</label>
          <select id="bd-site" class="inp" style="margin-bottom:14px">
            <option value="">Not recorded</option><option>Abdomen — lower L</option><option>Abdomen — lower R</option><option>Left thigh</option><option>Right thigh</option><option>Left glute</option><option>Right glute</option><option>Left flank</option><option>Right flank</option>
          </select>
        </section>
        <details class="nx-dose-section nx-dose-optional">
          <summary>Observations <span style="font-size:11px;color:var(--t3);font-weight:500;margin-left:auto">Optional</span></summary>
          <div class="nx-dose-optional-body"><label for="bd-notes" class="field-label">NOTES</label>
          <textarea id="bd-notes" class="inp" style="min-height:54px;resize:vertical;margin-bottom:14px" placeholder="Anything worth capturing…"></textarea></div>
        </details>
      </div>
      <div class="nx-dose-footer"><div class="nx-dose-review-note">Confirm the date, recorded amount, units and source before saving.</div>
        <button id="bd-save" class="btn-primary" style="background:#A78BFA;color:#1A1728;font-weight:700">CONFIRM LOG</button>
      </div>
    </div>
  `, "#A78BFA");
  m.classList.add("nx2-dose-modal");
  m.querySelector("#bd-close").onclick=closeModal;
  m.querySelector("#bd-now").onclick=()=>{m.querySelector("#bd-date").value=localDatetime();};

  const updatePreview = () => {
    const amt = Number(m.querySelector("#bd-amount").value);
    const shortage=m.querySelector("#bd-shortage");
    shortage.style.display=Number.isFinite(amt)&&amt>remainingMg+0.01?"block":"none";
    shortage.textContent="Not enough in current vial · "+Math.max(0,amt-remainingMg).toFixed(2)+" mg still needed. Open another vial before saving."; 
    const preview = m.querySelector("#bd-preview");
    if (!amt || !totalMg) { preview.innerHTML = ""; return; }
    preview.innerHTML = kit.composition.map(c => {
      const share = (c.mg/totalMg) * amt;
      return `${esc(c.compound)}: ${share.toFixed(2)}mg`;
    }).join(" · ");
  };
  m.querySelector("#bd-amount").oninput = updatePreview;

  m.querySelector("#bd-save").onclick = () => {
    const amt = parseFloat(m.querySelector("#bd-amount").value)||0;
    if (!Number.isFinite(amt) || amt <= 0 || !totalMg) {showErrorBanner("Enter a valid positive dose.");return;}
    // Never allow logging more than the open vial actually has — this was previously
    // unchecked entirely, meaning a typo or overestimate would silently push the vial's
    // remaining below zero with no warning, exactly the kind of negative-inventory state
    // this whole rebuild exists to prevent.
    if (amt > remainingMg + 0.01) {
      showErrorBanner(`Only ${remainingMg.toFixed(1)}mg remains in this vial — ${amt}mg wasn't logged. Adjust the amount or reconstitute a new vial first.`);
      return;
    }
    const date = m.querySelector("#bd-date").value || localDatetime();
    const site=m.querySelector("#bd-site").value;
    const notes = m.querySelector("#bd-notes").value;

    // One premixed dose belongs to the blend name. Do not create independent
    // administration records for Cartalax/BPC-157/TB-500 as if drawn separately.
    state.customPeptides=state.customPeptides||{};
    if(!state.customPeptides[kit.name]) initCompoundTracking(kit.name);
    const blend=state.customPeptides[kit.name]||state.peptides[kit.name];
    blend.doses=blend.doses||[];
    blend.doses.push({id:uid(),date,dose:String(amt),site,notes,blendSource:kit.id,isBlendDose:true});
    
    if (!kit.doseLog) kit.doseLog = [];
    const currentVial=ensureKitVials(kit).find(v=>v.status==="open"||v.status==="active");
    kit.doseLog.push({ id: uid(), date, totalMgDrawn: amt, notes, vialId:currentVial?.id });
    saveState(); closeModal(); render();
  };
}

function confirmAction(msg, cb, opts={}) {
  const toneColor = {danger:"#ff4d4d", success:"#7DF9C0", info:"#8AB4FF", warning:"#F9C87D"}[opts.tone] || "#ff4d4d";
  const confirmLabel = opts.confirmLabel || "Delete";
  const cancelLabel = opts.cancelLabel || "Cancel";
  const confirmText = (opts.tone==="success"||opts.tone==="warning") ? "#000" : "#fff";
  const m = openModal(`<div style="padding:8px">
    <div style="font-size:14px;color:var(--t1);margin-bottom:14px;line-height:1.5">${esc(msg)}</div>
    <div style="display:flex;gap:8px">
      <button id="ca-cancel" style="flex:1;padding:10px;border-radius:10px;border:1px solid var(--border);color:var(--t2);background:var(--surface-2)">${esc(cancelLabel)}</button>
      <button id="ca-ok" style="flex:1;padding:10px;border-radius:10px;background:${toneColor};color:${confirmText};font-weight:700">${esc(confirmLabel)}</button>
    </div>
  </div>`,toneColor);
  m.querySelector("#ca-cancel").onclick=closeModal;
  m.querySelector("#ca-ok").onclick=()=>{closeModal();cb();};
}

function isLight() { return document.documentElement.dataset.theme === "light"; }

function cfg(name) {
  const base = PEPTIDES[name] || FALLBACK_CFG;
  const stored = (PEPTIDES[name] ? state.peptides : state.customPeptides)[name];
  if (stored && stored.customColor) return { ...base, color: stored.customColor };
  return base;
}

// ─── Date helpers ─────────────────────────────────────────────────────────────
// Parse any date string safely — date-only strings get T12:00 to avoid UTC-midnight timezone shift
const safeDate = iso => iso ? (/^\d{4}-\d{2}-\d{2}$/.test(String(iso)) ? new Date(iso+'T12:00:00') : new Date(iso)) : null;
const fmtDate  = iso => iso ? safeDate(iso).toLocaleDateString("en-CA",{month:"short",day:"numeric",year:"numeric"}) : "—";
const fmtShort = iso => iso ? safeDate(iso).toLocaleDateString("en-CA",{month:"short",day:"numeric"}) : "—";
const fmtDT    = iso => iso ? new Date(iso).toLocaleString("en-CA",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}) : "—";
const daysSince = iso => iso ? ((Date.now()-safeDate(iso).getTime())/86400000) : null;
const daysUntil = iso => iso ? ((safeDate(iso).getTime()-Date.now())/86400000) : null;
// Shared axis helpers for SVG charts. "Nice" round tick values (0/2/4 instead of an
// arbitrary 0/2.25/4.51 from splitting a raw max into equal fractions) keep an axis easy
// to scan and never produces two ticks close enough to visually collapse. monoTextWidth
// gives a chart a real number to reserve for its own axis margin instead of a small
// fixed value that clips whenever a label is wider than whatever was eyeballed at the
// time — a two-digit value, a longer unit string, or larger iPhone accessibility text
// all silently push labels outside a hard-coded margin otherwise.
function niceAxisTicks(maxValue, targetCount) {
  if (!(maxValue > 0)) return { ticks: [0], decimals: 0 };
  const rawStep = maxValue / Math.max(1, targetCount);
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const norm = rawStep / mag;
  const niceNorm = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
  const step = niceNorm * mag;
  const decimals = Math.max(0, -Math.floor(Math.log10(step)));
  const scale = Math.pow(10, decimals);
  const ticks = [];
  for (let v = 0; v < maxValue - step*0.001; v += step) ticks.push(Math.round(v*scale)/scale);
  return { ticks, decimals };
}
const MONO_CHAR_W = 0.62; // approx fraction of font-size per monospace character
function monoTextWidth(str, fontSize) { return String(str).length * fontSize * MONO_CHAR_W; }
// The one shared "time left" formatter for every protocol card — magnitude-based, not
// schedule-type-based. Previously the daily-vs-non-daily ring picked hours-vs-days by
// asking "is this compound's cycle exactly 1 day," which is a question about the
// schedule, not about how much time is actually left — a compound dosed multiple times
// within a day but on a longer overall cycle (e.g. Placenta, twice-daily dosing on a
// weekly cycle) fell into hour-mode and showed "159h" for something six-plus days away.
// This asks the only question that actually matters for readability: how big is the
// number. <24h → whole hours. >=24h → days to one decimal, trailing .0 dropped so a
// clean week reads "7d" rather than "7.0d".
function formatCountdown(daysLeft) {
  const hours = Math.max(0, daysLeft) * 24;
  if (hours < 24) return Math.round(hours) + "h";
  const days = Math.round(hours/24*10)/10;
  return (days % 1 === 0 ? days.toFixed(0) : days.toFixed(1)) + "d";
}
const addDays   = (iso,n) => { const d=safeDate(iso); d.setDate(d.getDate()+n); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); };
const WD_ABBR = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
function nextWeekdayDue(fromDateStr, weekdays) {
  const from = safeDate(fromDateStr);
  for (let i=1; i<=7; i++) {
    const cand = new Date(from); cand.setDate(cand.getDate()+i);
    if (weekdays.includes(cand.getDay())) return dayKey(cand);
  }
  return addDays(dayKey(fromDateStr), 7);
}
function isWeekdaySchedule(data) { return data.scheduleType==="weekdays" && Array.isArray(data.scheduleWeekdays) && data.scheduleWeekdays.length>0; }

// ─── Protocol phases drive the actual schedule ──────────────────────────────
// A compound's phases live HERE, on the compound record — the same object that already
// owns dosesPerDay/times — not on state.protocols (Protocol Builder's dose-escalation
// phases were verified to never reach the dosing engine at all; rather than wire two
// systems together, this is the one place the engine already looks). Each phase can
// override BOTH the dose-amount progression AND the schedule cadence/occurrence
// structure. Compounds with no data.phases behave exactly as before — fully backward
// compatible for every existing single-schedule compound.
function getCompoundPhase(data, dateStr) {
  const phases = data.phases;
  if (!phases || !phases.length) return null;
  const start = data.startDate || (data.doses&&data.doses.length ? dayKey([...data.doses].sort((a,b)=>new Date(a.date)-new Date(b.date))[0].date) : null);
  if (!start) return null;
  const daysIn = Math.floor((new Date(dayKey(dateStr)+"T00:00:00").getTime() - new Date(start+"T00:00:00").getTime())/86400000);
  if (daysIn < 0) return null;
  let cursor = 0;
  for (const ph of phases) {
    const durDays = Math.round((ph.durationWeeks||4)*7);
    if (daysIn < cursor+durDays) return ph;
    cursor += durDays;
  }
  return phases[phases.length-1]; // past all defined phases — hold on the last one (maintenance) rather than falling off the schedule entirely
}
// Where the phase containing a date starts and ends — the same day arithmetic
// getCompoundPhase uses, but returning the BOUNDARIES instead of just the phase object.
// Needed so a rest phase can be treated as one block (jumped over in a single step, and
// described as "week 2 of 4, resumes Oct 25") instead of being walked through at some
// arbitrary interval, which could land on the wrong day or in the middle of the next phase.
function getPhaseSpan(data, dateStr) {
  const phases = data.phases;
  if (!phases || !phases.length) return null;
  const start = data.startDate || (data.doses&&data.doses.length ? dayKey([...data.doses].sort((a,b)=>new Date(a.date)-new Date(b.date))[0].date) : null);
  if (!start) return null;
  const daysIn = Math.floor((new Date(dayKey(dateStr)+"T00:00:00").getTime() - new Date(start+"T00:00:00").getTime())/86400000);
  if (daysIn < 0) return null;
  let cursor = 0;
  for (let i=0; i<phases.length; i++) {
    const durDays = Math.round((phases[i].durationWeeks||4)*7);
    const isLast = i === phases.length-1;
    if (daysIn < cursor+durDays || isLast) {
      return {
        phase: phases[i], index: i, isLast,
        startDay: addDays(start, cursor),
        // First day AFTER this phase. null for the final phase: getCompoundPhase holds on
        // the last phase indefinitely rather than running off the end, so nothing follows it.
        nextStartDay: isLast ? null : addDays(start, cursor+durDays),
        weekInPhase: Math.min(Math.floor(Math.max(0, daysIn-cursor)/7)+1, Math.max(1, Math.round(durDays/7))),
        totalWeeks: Math.max(1, Math.round(durDays/7)),
      };
    }
    cursor += durDays;
  }
  return null;
}
// The schedule that applies ON A SPECIFIC DATE — from the active phase if the compound
// is phased, otherwise the compound's own top-level fields. This is what every
// date-scoped calculation below must consult instead of reading data.scheduleDays etc.
// directly, since the effective schedule can change mid-protocol at a phase boundary.
// Protocol Builder's schedule uses a "type" label (Daily/Weekly/Weekdays/etc.) + a raw
// weekday array — convert that into the engine's scheduleWeekdays/scheduleDays shape.
// Weekly/Weekdays/3x-per-week are inherently "specific days" cadences; Daily/Every Other
// Day are plain intervals.
function convertBuilderSchedule(s) {
  // Defensive: a protocol from before this field existed, or an incomplete draft, could
  // reach here with no schedule object at all — fall back to a sane daily default rather
  // than crashing the entire sync (and anything downstream of it) on missing data.
  if (!s) return { scheduleWeekdays: null, scheduleDays: 1, dosesPerDay: 1, times: ["08:00"] };
  const weekdayTypes = ["Weekly","Weekdays","3x/Week"];
  if (weekdayTypes.includes(s.type) && s.days && s.days.length) {
    return { scheduleWeekdays: [...s.days].sort((a,b)=>a-b), scheduleDays: 7, dosesPerDay: s.dosesPerDay||1, times: s.times||["08:00"] };
  }
  return { scheduleWeekdays: null, scheduleDays: s.type==="Every Other Day"?2:1, dosesPerDay: s.dosesPerDay||1, times: s.times||["08:00"] };
}
// The missing link: Protocol Builder's phases/schedule were verified to never reach the
// dosing engine (state.peptides/customPeptides) — this is what actually writes them
// there, onto the SAME fields getEffectiveSchedule/nextDueDate/getDoseStatus already
// read. Called whenever a protocol is saved, so "New Protocol" isn't just a planning
// document — it's what Today/Next/Log Dose actually use going forward.
function syncProtocolToCompoundData(proto) {
  proto.compounds.forEach(c => {
    const builtin = !!PEPTIDES[c.name];
    const tgt = builtin ? state.peptides : state.customPeptides;
    if (!tgt[c.name]) tgt[c.name] = { status:"active", doses:[] };
    const t = tgt[c.name];
    if (!t.status || t.status==="archived") t.status = "active";
    const sched = c.schedule || proto.schedule;
    const base = convertBuilderSchedule(sched);
    t.scheduleType = base.scheduleWeekdays ? "weekdays" : "interval";
    t.scheduleWeekdays = base.scheduleWeekdays;
    t.scheduleDays = base.scheduleDays;
    t.dosesPerDay = base.dosesPerDay;
    t.times = base.times;

    if (c.multiPhase && c.phases && c.phases.length) {
      t.startDate = proto.startDate || localDate();
      t.phases = c.phases.map(ph => ({
        durationWeeks: ph.durationWeeks||4,
        dose: ph.type==="rest" ? "" : (ph.dose||""),
        isRest: ph.type==="rest",
        schedule: ph.schedule ? convertBuilderSchedule(ph.schedule) : { scheduleWeekdays:base.scheduleWeekdays, scheduleDays:base.scheduleDays, dosesPerDay:base.dosesPerDay, times:base.times },
      }));
    } else if (t.phases) {
      t.phases = []; // protocol no longer multi-phase — don't leave a stale phase list behind
    }
  });
}

function getEffectiveSchedule(data, dateStr) {
  const ph = getCompoundPhase(data, dateStr);
  if (ph && ph.isRest) {
    // A rest phase generates NO occurrences at all — dosesPerDay:0 propagates cleanly
    // through getOccurrenceTimes (Math.max(1,...) is intentionally NOT applied here; the
    // occurrence generator checks for isRest directly, see below) rather than needing a
    // separate "skip this compound" branch scattered through every caller.
    return { scheduleWeekdays:null, scheduleDays:data.scheduleDays||7, dosesPerDay:0, times:null, doseAmounts:null, phase:ph, isRest:true };
  }
  if (ph && ph.schedule) {
    return {
      scheduleWeekdays: ph.schedule.scheduleWeekdays || null,
      scheduleDays: ph.schedule.scheduleDays || data.scheduleDays || 7,
      dosesPerDay: ph.schedule.dosesPerDay || 1,
      times: ph.schedule.times || null,
      doseAmounts: ph.schedule.doseAmounts || (ph.dose!=null ? [ph.dose] : null),
      phase: ph,
    };
  }
  return {
    scheduleWeekdays: data.scheduleWeekdays||null,
    scheduleDays: data.scheduleDays||7,
    dosesPerDay: data.dosesPerDay||1,
    times: data.times||null,
    doseAmounts: data.doseAmounts||null,
    phase: null,
  };
}

// ─── Multi-dose-per-day occurrence support ──────────────────────────────────
// A compound's dosesPerDay/times live on the compound record itself (data), the same
// place scheduleDays/scheduleWeekdays already live — NOT on protocol.schedule, which is
// UI-only config that never reached the dosing engine before this. Legacy compounds with
// no dosesPerDay behave as exactly one occurrence per scheduled day, unchanged.
function getOccurrenceTimes(data, dateStr) {
  const sched = getEffectiveSchedule(data, dateStr||localDate());
  if (sched.isRest) return []; // rest phase: zero occurrences, not "dosesPerDay||1" falling back to 1
  const n = Math.max(1, sched.dosesPerDay||1);
  // For a slot with no EXPLICITLY configured time, fall back to the time-of-day of the
  // most recent logged dose (matching the compound's own actual dosing pattern) rather
  // than a generic default like 08:00/20:00 — a compound that's always been injected
  // around 11:50 PM must stay anchored to 11:50 PM, not silently jump to a made-up
  // default that can land hours in the past and falsely read as overdue.
  const sorted = [...(data.doses||[])].sort((a,b)=>new Date(a.date)-new Date(b.date));
  const lastDoseTime = sorted.length ? timeKeyOf(sorted[sorted.length-1].date) : null;
  // Single-dose-per-day (the overwhelmingly common case) anchors to the last dose's own
  // time when nothing was explicitly configured. Genuine multi-dose setups still get
  // varied starting defaults (Morning/Evening-ish) since those slots are visibly
  // presented for the user to configure in the schedule settings anyway.
  const fallback = n===1 && lastDoseTime ? [lastDoseTime] : ["08:00","20:00","14:00","02:00"];
  const times = [];
  for (let i=0;i<n;i++) {
    // For a single daily dose specifically, real dosing history is a more reliable
    // signal of when it's actually due than a configured time slot — this is exactly
    // what made BPC-157 wrong while GHK-Cu (no configured time at all) was correct:
    // BPC had a stale/default times:["09:00"] left over from before any doses existed,
    // and 47 consecutive real doses at 9:37 PM never overrode it because an explicit
    // config always won regardless of how consistently actual behavior disagreed with
    // it. Once there's real history for a single-dose compound, that history IS the
    // schedule. Multi-dose compounds (n>1) still need explicit per-slot times, since a
    // single "last dose time" can't be split across multiple distinct slots.
    if (n===1 && lastDoseTime) times.push(lastDoseTime);
    else times.push((sched.times&&sched.times[i]) || fallback[i] || lastDoseTime || "08:00");
  }
  return times;
}
function occurrenceDoseAmount(data, i, dateStr) {
  const sched = getEffectiveSchedule(data, dateStr||localDate());
  return (sched.doseAmounts && sched.doseAmounts[i]!=null && sched.doseAmounts[i]!=="") ? sched.doseAmounts[i] : null;
}
// The live "total daily dose" summary shown under Schedule Settings' per-slot amount
// inputs — the split/total relationship the whole point of configuring per-slot amounts
// is to make clear, rather than each slot's number sitting there with no sense of what
// they add up to. Purely a display computed FROM the configured splits (this data model
// doesn't have a separate "intended total" field to validate against) — a blank slot
// means "not yet decided," so the total is marked as partial rather than silently
// treating a blank as zero.
function dpdTotalLine(data, unit) {
  const n = Math.max(1, data.dosesPerDay||1);
  if (n<=1) return "";
  const amounts = Array.from({length:n}, (_,i)=>occurrenceDoseAmount(data,i));
  const filled = amounts.filter(a=>a!=null && a!=="");
  if (!filled.length) return `<span style="color:var(--t5)">No per-dose amounts set — each logs independently with whatever you enter at the time.</span>`;
  const sum = filled.reduce((a,x)=>a+(parseFloat(x)||0),0);
  const parts = amounts.map(a=>a!=null&&a!==""?`${a}${unit}`:"?").join(" + ");
  return filled.length<n
    ? `Total so far: <b style="color:var(--t2)">${sum}${unit}</b> (${filled.length}/${n} set) — ${parts}`
    : `Total daily dose: <b style="color:var(--t2)">${sum}${unit}</b> · split ${parts}`;
}
const timeKeyOf = dt => {
  // A date-only string ("2026-08-09", no time) must NEVER be parsed with new Date() for
  // its clock time — that parses as UTC midnight, which in a negative-UTC-offset
  // timezone becomes 8 PM the PREVIOUS day locally. This was the exact source of a
  // phantom mistimed occurrence: a legacy reschedule record stored with only a date
  // (from before reschedules tracked time) silently became "8:00 PM" here.
  if (typeof dt === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dt)) return null;
  const d = new Date(dt);
  return String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0");
};
const timeToMinutes = t => { const [h,m]=(t||"00:00").split(":").map(Number); return h*60+(m||0); };

// Is `dayStr` actually a day this compound's REGULAR (non-rescheduled) cadence would
// produce an occurrence on? Weekday-mode is a direct calendar check. Interval-mode has
// no fixed calendar anchor, so it's derived by walking the compound's own effective
// schedule forward from its first dose — the same stepping logic nextDueDate() already
// uses — until reaching or passing the target day. Without this check, getDayOccurrences
// would generate a "regular" slot for literally any date, including days the compound
// was never actually scheduled on (e.g. a Sunday for a Mon/Wed/Fri protocol).
function isCadenceDay(data, dayStr) {
  const target = dayKey(dayStr);
  const sched = getEffectiveSchedule(data, target);
  if (sched.scheduleWeekdays) {
    const dow = new Date(target+"T12:00:00").getDay();
    return sched.scheduleWeekdays.includes(dow);
  }
  const sorted = [...(data.doses||[])].sort((a,b)=>new Date(a.date)-new Date(b.date));
  if (!sorted.length) return target===localDate();
  let anchor = dayKey(sorted[0].date);
  if (target < anchor) return false;
  let guard=0;
  while (anchor < target && guard++<1000) {
    const s = getEffectiveSchedule(data, addDays(anchor,1));
    anchor = s.scheduleWeekdays ? nextWeekdayDue(anchor, s.scheduleWeekdays) : addDays(anchor, s.scheduleDays||7);
  }
  return anchor === target;
}

// ─── Pause-interval engine ───────────────────────────────────────────────────
// The single source of truth for "was a dose actually expected at this moment," per the
// rule that time inside a protocol pause carries no dose obligation at all. Every
// schedule/adherence calculation in the app must ask THIS, not independently decide
// whether a gap in dose history was a pause, a skip, or a genuine miss.
//
// Matches by object identity against state.peptides/state.customPeptides rather than
// requiring callers to thread a compound name through — getDayOccurrences and everything
// built on it already only ever receive the compound's own data object, never its name,
// and changing that signature would mean touching every call site for no real benefit.
function protocolForData(data) {
  return (state.protocols||[]).find(p => (p.compounds||[]).some(c =>
    (state.peptides[c.name]||state.customPeptides?.[c.name]) === data
  )) || null;
}
// Every pause interval a protocol has been through — closed ones from pauseHistory, plus
// the current one (end=Infinity) if it's paused right now and hasn't been resumed yet.
function protocolPauseIntervals(protocol) {
  if (!protocol) return [];
  const intervals = (protocol.pauseHistory||[]).map(h => ({
    start: new Date(h.pausedAt).getTime(),
    end: new Date(h.resumedAt).getTime(),
  }));
  if (protocol.status === "paused" && protocol.pausedAt) {
    intervals.push({ start: new Date(protocol.pausedAt).getTime(), end: Infinity });
  }
  return intervals;
}
function wasDoseExpected(data, dateTimeMs) {
  const protocol = protocolForData(data);
  if (!protocol) return true; // standalone compounds (no protocol) have no pause concept
  return !protocolPauseIntervals(protocol).some(iv => dateTimeMs >= iv.start && dateTimeMs < iv.end);
}
// Shared pause/resume actions — was previously duplicated verbatim across the "Manage
// protocol" sheet and the inline protocol-list buttons, and neither recorded WHEN a pause
// ran, only a running day-count (pauseDaysAccumulated). That's enough to shift phase
// timing on resume, but not enough to ever answer "was a dose expected on this specific
// date" after the fact — which is exactly the question adherence/overdue/missed all need
// answered. pauseHistory is the actual historical record; pauseDaysAccumulated is kept
// alongside it unchanged, since existing phase-timing math already depends on it.
function pauseProtocol(p) {
  p.status = "paused";
  p.pausedAt = localDatetime();
}
function resumeProtocol(p) {
  if (!p.pausedAt) return;
  const resumedAt = localDatetime();
  p.pauseHistory = p.pauseHistory || [];
  p.pauseHistory.push({ pausedAt: p.pausedAt, resumedAt });
  const pausedDays = Math.max(0, Math.round((new Date(resumedAt)-new Date(p.pausedAt))/86400000));
  p.pauseDaysAccumulated = (p.pauseDaysAccumulated||0) + pausedDays;
  p.pausedAt = null;
  p.status = "in_progress";
}

// Resolve every occurrence SLOT for one calendar day against actual doses/skips/
// reschedules, via nearest-time greedy matching so same-day multiple doses are never
// double-counted or conflated. Also surfaces occurrences RESCHEDULED INTO this day from
// elsewhere (isRescheduledIn) — this is what lets a moved Friday-evening dose sit
// alongside a normal Monday morning+evening without either being silently dropped.
function getDayOccurrences(data, dayStr) {
  const dk = dayKey(dayStr);
  // Regular (non-rescheduled) slots only exist on days that are actually part of this
  // compound's own cadence — a rescheduled-in occurrence below can still add a slot to a
  // day that isn't otherwise scheduled (e.g. MOTS-c's Friday dose moved to Sunday).
  const isRegularDay = isCadenceDay(data, dk);
  const times = isRegularDay ? getOccurrenceTimes(data, dk) : [];
  const slots = times.map((t,i)=>({index:i, time:t, dateTime:slotDateTime(dk,t), status:"pending", dose:null, skip:null, reschedule:null, doseAmount:occurrenceDoseAmount(data,i,dk)}));

  const doseEvents = (data.doses||[]).filter(d=>doseDayFor(data,d)===dk).map(d=>({kind:"dose",time:timeKeyOf(d.date),ref:d}));
  // A skip RECORD's own .kind field (default "skipped" for every pre-existing record,
  // which never had this field) distinguishes intentional-skip from explicit-missed —
  // both live in the same data.skips array and share all the same "this occurrence is
  // resolved" plumbing (isResolved, getMostRecentSkip, the walk-forward loops), they just
  // resolve to a different terminal slot status so history and adherence can tell them
  // apart, per the Resolve Overdue rule that missed ≠ skipped ≠ paused.
  const skipEvents = (data.skips||[]).filter(s=>dayKey(s.date)===dk).map(s=>({kind:s.kind==="missed"?"missed_resolved":"skip",time:timeKeyOf(s.date),ref:s}));
  const reschedAwayEvents = (data.reschedules||[]).filter(r=>dayKey(r.originalDate)===dk).map(r=>({kind:"resched_away",time:timeKeyOf(r.originalDate),ref:r}));

  [...doseEvents, ...skipEvents, ...reschedAwayEvents].forEach(ev=>{
    let best=null, bestDist=Infinity;
    slots.forEach(s=>{ if(s.status!=="pending") return; const d=Math.abs(logicalMinutes(ev.time)-logicalMinutes(s.time)); if(d<bestDist){bestDist=d;best=s;} });
    if (best) {
      if (ev.kind==="dose") { best.status="taken"; best.dose=ev.ref; }
      else if (ev.kind==="skip") { best.status="skipped"; best.skip=ev.ref; }
      else if (ev.kind==="missed_resolved") { best.status="missed"; best.skip=ev.ref; }
      else if (ev.kind==="resched_away") { best.status="moved"; best.reschedule=ev.ref; }
      return;
    }
    // No slot to absorb this into (e.g. a real dose logged on a day with no regular
    // cadence slot and no matching reschedule-in) — a logged dose must never be silently
    // dropped from the day's record just because there was nowhere "expected" to put it.
    if (ev.kind==="dose") slots.push({index:slots.length, time:ev.time||"00:00", dateTime:(ev.time ? (typeof ev.ref.date==="string" && /T\d{2}:\d{2}/.test(ev.ref.date) ? ev.ref.date : slotDateTime(dk,ev.time)) : dk+"T00:00"), status:"taken", dose:ev.ref, skip:null, reschedule:null, doseAmount:null, adhoc:true});
    else if (ev.kind==="skip") slots.push({index:slots.length, time:ev.time||"00:00", dateTime:(ev.time?slotDateTime(dk,ev.time):dk+"T00:00"), status:"skipped", dose:null, skip:ev.ref, reschedule:null, doseAmount:null, adhoc:true});
    else if (ev.kind==="missed_resolved") slots.push({index:slots.length, time:ev.time||"00:00", dateTime:(ev.time?slotDateTime(dk,ev.time):dk+"T00:00"), status:"missed", dose:null, skip:ev.ref, reschedule:null, doseAmount:null, adhoc:true});
  });

  // A reschedule landing ON this day (its newDate) adds an EXTRA slot here — but ONLY if
  // it's still genuinely the active/pending chain tip. A reschedule that's been
  // superseded by normal dosing since (a real dose logged on some OTHER day after this
  // reschedule's originalDate) is stale history, not a still-pending occurrence — without
  // this check, an old reschedule record could resurrect itself as a phantom dose
  // indefinitely, on a compound that's been dosing normally ever since.
  (data.reschedules||[]).filter(r=>dayKey(r.newDate)===dk).forEach(r=>{
    // A legacy date-only newDate has no real clock time to recover — use the compound's
    // OWN configured/inferred time-of-day instead of inventing one via timezone-shifted
    // date parsing (the exact bug behind the phantom 8 PM).
    const landTime = timeKeyOf(r.newDate) || getOccurrenceTimes(data, dk)[0] || "09:00";
    const resolved = (data.doses||[]).some(d=>doseDayFor(data,d)===dk&&(timeKeyOf(d.date)===landTime||slots.some(s=>s.status==="taken"&&s.dose===d)))
      || (data.skips||[]).some(s=>dayKey(s.date)===dk&&timeKeyOf(s.date)===landTime)
      || (data.reschedules||[]).some(r2=>dayKey(r2.originalDate)===dk&&timeKeyOf(r2.originalDate)===landTime);
    if (resolved) return;
    const supersededByLaterDose = (data.doses||[]).some(d => new Date(d.date).getTime() > new Date(r.originalDate).getTime() && doseDayFor(data,d)!==dk);
    if (supersededByLaterDose) return;
    slots.push({index:slots.length, time:landTime, dateTime:slotDateTime(dk,landTime), status:"pending", dose:null, skip:null, reschedule:r, isRescheduledIn:true, doseAmount:null});
  });

  const now = Date.now();
  const grace = (state.settings.graceHours||3)*3600000;
  slots.forEach(s=>{
    if (s.status==="pending") {
      const t = new Date(s.dateTime).getTime();
      // Paused ≠ missed ≠ skipped — a pause means there was no obligation at all, so this
      // must be checked before, and separately from, the overdue/due_now/upcoming logic
      // below, not folded into any of those buckets.
      if (!wasDoseExpected(data, t)) { s.status = "paused"; return; }
      s.status = (now-t)>grace ? "overdue" : t<=now ? "due_now" : (dk===localDate() ? "due_later_today" : "upcoming");
    }
  });
  return slots.sort((a,b)=>cmpSlotTime(a.time,b.time));
}
// Day-level rollup used by anything that just wants "is today fully handled" or a count.
function getDayOccurrenceSummary(data, dayStr) {
  const slots = getDayOccurrences(data, dayStr);
  const resolved = slots.filter(s=>["taken","skipped","moved"].includes(s.status));
  const pending = slots.filter(s=>!["taken","skipped","moved"].includes(s.status));
  return { slots, total:slots.length, completed:slots.filter(s=>s.status==="taken").length, resolvedCount:resolved.length, pending };
}

// Planned vs. actual timing — how far off from the scheduled slot doses actually get
// logged. Only meaningful when the compound has an EXPLICIT target time somewhere
// (top-level data.times, or a phase's schedule.times) — not the engine's silent
// ["08:00",...] fallback used for compounds that never had a real target set, which
// would otherwise manufacture a misleading "always X min late" reading against a time
// nobody ever actually intended.
function hasExplicitTimes(data) {
  if (data.times && data.times.length) return true;
  if (data.phases && data.phases.some(ph=>ph.schedule && ph.schedule.times && ph.schedule.times.length)) return true;
  return false;
}
function getTimingVariance(data) {
  if (!hasExplicitTimes(data)) return null;
  const doseDays = [...new Set((data.doses||[]).map(d=>dayKey(d.date)))];
  if (doseDays.length < 5) return null; // too little history for a meaningful average
  const deltas = [];
  doseDays.forEach(day => {
    getDayOccurrences(data, day).forEach(s => {
      if (s.status==="taken" && s.dose) deltas.push(timeToMinutes(timeKeyOf(s.dose.date)) - timeToMinutes(s.time));
    });
  });
  if (deltas.length < 5) return null;
  const avg = deltas.reduce((a,b)=>a+b,0)/deltas.length;
  return { avgMinutes: Math.round(avg), sampleSize: deltas.length };
}

// ─── Canonical occurrence-state layer ───────────────────────────────────────
// The single source of truth for "what happened to this scheduled occurrence" — every
// screen (Today, Protocol, Calendar, weekly summary, adherence, Nexus) must consume this
// rather than independently re-deriving it from doses/skips/reschedules.
